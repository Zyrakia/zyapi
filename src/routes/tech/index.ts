import { TechnologiesController } from '@/controllers/technologies.controller.ts';
import { documentedRoute } from '@/utils/documented-route.ts';
import { q } from '@/utils/query.ts';
import { z } from 'zod';

type Response = Awaited<
	ReturnType<
		| typeof TechnologiesController.getTechnologies
		| typeof TechnologiesController.getTechnologiesUsedByProject
	>
>;

/**
 * Returns information about a technology by its ID.
 *
 * @query used_by_project when specified, returns only the technologies that were used by the project associated with the specified ID
 */
export const get = documentedRoute<Response>(async (req, _, resolve) => {
	const { used_by_project } = q(req.query, { used_by_project: z.coerce.number() });

	const technologies = used_by_project
		? await TechnologiesController.getTechnologiesUsedByProject(used_by_project)
		: await TechnologiesController.getTechnologies();

	resolve.okWith(technologies);
});
