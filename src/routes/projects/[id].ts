import { ProjectsController } from '@/controllers/projects.controller.ts';
import { documentedRoute } from '@/utils/documented-route.ts';
import { q } from '@/utils/query.ts';
import { z } from 'zod';

type Response = Awaited<
	ReturnType<typeof ProjectsController.getProject | typeof ProjectsController.getProjectWithTechnologies>
>;

/**
 * Returns information about a project by the ID of the project.
 *
 * @query technologies whether to include the technologies used by the project
 */
export const get = documentedRoute<Response>(async (req, _, resolve) => {
	const id = parseInt(req.params.id);
	if (isNaN(id)) return resolve.badRequest('The specified project ID is not a valid number.');

	const { technologies } = q(req.query, { technologies: z.coerce.boolean() });
	let project = technologies
		? await ProjectsController.getProjectWithTechnologies(id)
		: await ProjectsController.getProject(id);

	if (!project) return resolve.notFound('The specified project does not exist.');
	resolve.okWith(project);
});
