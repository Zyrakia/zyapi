import { TechnologiesController } from '@/controllers/technologies.controller.ts';
import { documentedRoute } from '@/utils/documented-route.ts';
import { q } from '@/utils/query.ts';
import { z } from 'zod';

type Response = Awaited<
	ReturnType<
		typeof TechnologiesController.getTechnology | typeof TechnologiesController.getTechnologyWithProjects
	>
>;

/**
 * Returns information about a technology by its ID.
 *
 * @query with_projects whether to include the projects that the technology is used in
 */
export const get = documentedRoute<Response>(async (req, _, resolve) => {
	const id = parseInt(req.params.id);
	if (isNaN(id)) return resolve.badRequest('The specified technology ID is not a valid number.');

	const { with_projects: withProjects = false } = q(req.query, { with_projects: z.coerce.boolean() });

	let technology = withProjects
		? await TechnologiesController.getTechnologyWithProjects(id)
		: await TechnologiesController.getTechnology(id);

	if (!technology) return resolve.notFound('The specified technology does not exist.');
	resolve.okWith(technology);
});
