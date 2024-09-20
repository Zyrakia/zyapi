import { CommentStatement, Node, Project, SourceFile, SyntaxKind, ts, Type, TypeFormatFlags } from 'ts-morph';

import { readdir } from 'node:fs/promises';
import path, { join, parse } from 'node:path';
import { logger } from '@/utils/log.ts';
import { green, red, dim, yellow } from 'recolors';
import { footprintOfType } from './type-footprint.ts';

import { MarkdownDocument, md } from 'build-md';

const log = logger('[API Generator]');

const validRoutes = ['get', 'post', 'put', 'delete', 'patch'];

async function collectRouteFiles(root: string) {
	const routes: string[] = [];
	for (const file of await readdir(root)) {
		const rootedPath = path.join(root, file);
		if (file.endsWith('.ts')) {
			routes.push(rootedPath);
			continue;
		}

		routes.push(...(await collectRouteFiles(rootedPath)));
	}

	return routes;
}

const routesRoot = path.join('src', 'routes');
log('Extracting routes from ' + routesRoot);
const routeFiles = await collectRouteFiles(routesRoot);
log(`Found ${routeFiles.length} routes`);

const project = new Project({
	compilerOptions: { noEmit: true },
	tsConfigFilePath: path.join('tsconfig.json'),
});

function extractRoute(absoluteFilePath: string) {
	const [_, routePath] = absoluteFilePath.replaceAll('/', path.sep).split(routesRoot);
	if (!routePath) return;

	const standardizedPath = routePath
		.replaceAll('.ts', '')
		.replaceAll(path.sep, '/')
		.replaceAll('index', '');

	if (standardizedPath.endsWith('/') && standardizedPath.length > 1) return standardizedPath.slice(0, -1);

	return standardizedPath;
}

function extractRouteMetadata(routeFile: SourceFile) {
	const route = extractRoute(routeFile.getFilePath());
	if (!route) return;

	const exports = routeFile.getExportedDeclarations();
	if (exports.size === 0) return;

	const handlers = [];
	for (const [handlerType, handlerDeclarations] of exports) {
		if (!validRoutes.includes(handlerType)) continue;
		if (handlerDeclarations.length !== 1) continue;

		const handlerDeclaration = handlerDeclarations[0]?.asKind(SyntaxKind.VariableDeclaration);
		if (!handlerDeclaration) continue;

		const handlerInitializer = handlerDeclaration.getInitializerIfKind(SyntaxKind.CallExpression);
		if (!handlerInitializer) continue;

		const handlerInitializerIdentifier = handlerInitializer?.getExpressionIfKind(SyntaxKind.Identifier);
		if (handlerInitializerIdentifier?.getText() !== 'documentedRoute') continue;

		const routeTypes = handlerInitializer.getTypeArguments();
		const [successTypeNode, bodyTypeNode] = routeTypes;
		const successType = successTypeNode
			? footprintOfType({ node: successTypeNode, type: successTypeNode.getType() })
			: undefined;
		const bodyType = bodyTypeNode
			? footprintOfType({ node: bodyTypeNode, type: bodyTypeNode.getType() })
			: undefined;

		const comments = handlerDeclaration.getVariableStatement()?.getJsDocs();
		if (!comments) return;

		const [routeComment] = comments;
		const routeDescription = routeComment?.getCommentText();
		if (!routeComment || !routeDescription) {
			log(red('Could not extract route description for ' + route));
			return;
		}

		const routeProperties = routeComment.getTags();

		const properties = [];
		for (const routeProperty of routeProperties) {
			const kind = routeProperty.getTagName();
			const [label, ...description] = routeProperty.getCommentText()?.split(' ') ?? [];
			if (!label || !description) continue;
			properties.push({ kind, label, description: description.join(' ') });
		}

		handlers.push({
			kind: handlerType,
			successType: successType,
			bodyType: bodyType,
			description: routeDescription,
			properties: properties,
		});
	}

	return {
		route,
		handlers,
	};
}

console.log();
log('Extracting routes metadata');

const routesMeta: ReturnType<typeof extractRouteMetadata>[] = [];
for (const routeFilePath of routeFiles) {
	const routeFile = project.getSourceFileOrThrow(routeFilePath);
	if (!routeFile) {
		log(red(`The route file ${routeFilePath} was not loaded by Typescript in this project.`));
		continue;
	}

	const meta = extractRouteMetadata(routeFile);
	if (!meta) {
		log(red(`Could not extract route metadata for ${routeFile.getFilePath()}`));
		continue;
	}

	const nHandlers = meta.handlers.length;
	log(
		`Extracted metadata for "${meta.route}" (${
			nHandlers > 0 ? green(nHandlers) : red(nHandlers)
		} documented handler${nHandlers !== 1 ? 's - skipping' : ''})`,
	);

	if (meta.handlers.length === 0) continue;
	routesMeta.push(meta);
}

console.log();
log('Rendering extracted metadata');

function mdRenderRoute(route: (typeof routesMeta)[number]) {
	if (!route) return;

	return new MarkdownDocument().$foreach(route.handlers, (doc, handler) => {
		return doc.details(
			md`${md.code(handler.kind)} ${md.code(`<b>${route.route}</b>`)} - ${handler.description}`,
			new MarkdownDocument()
				.$if(handler.properties.length > 0, (doc) => {
					return doc.heading(3, 'Properties').table(
						['Type', 'Name', 'Description'],
						handler.properties.map((prop) => [prop.kind, prop.label, prop.description]),
					);
				})
				.$if(!!handler.successType, (doc) =>
					doc.heading(3, 'Response Schema').code('ts', handler.successType),
				)
				.$if(!!handler.bodyType, (doc) =>
					doc.heading(3, 'Request Schema').code('ts', handler.bodyType),
				),
		);
	});
}

function renderRouteDeclarations(routes: typeof routesMeta) {
	const lines = [];

	lines.push(
		'type HandlerType<ResponseSchema, RequestSchema> = { response: ResponseSchema; request: RequestSchema };\n',
	);

	lines.push('declare type Routes = {');

	for (const route of routes) {
		if (!route) continue;

		lines.push(`"${route.route}": {`);
		for (const handler of route.handlers) {
			if (!handler.bodyType && !handler.successType) continue;
			lines.push(
				`\t"${handler.kind}": HandlerType<${handler.successType ?? 'never'}, ${
					handler.bodyType ?? 'never'
				}>;`,
			);
		}
		lines.push('};');
	}

	lines.push('};');

	return lines.join('\n');
}

const mdOut = join(__dirname, 'routes.gen.md');
Bun.write(
	mdOut,
	new MarkdownDocument().$foreach(routesMeta, (doc, meta) => doc.$concat(mdRenderRoute(meta))).toString(),
);
log(`Rendered markdown at ${mdOut}`);

const generatedDts = renderRouteDeclarations(routesMeta);
const newSource = project.createSourceFile(join(__dirname, 'routes.gen.d.ts'), generatedDts, {
	overwrite: true,
});

newSource.formatText();

Bun.write(newSource.getFilePath(), newSource.getFullText());
log(`Rendered declarations at ${newSource.getFilePath()}`);
