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
 * @query project_filter 
 */
export const get = documentedRoute<Response>(async (req, _, resolve) => {
	const { project_filter } = q(req.query, { project_filter: z.coerce.number() });

	const technologies = project_filter
		? await TechnologiesController.getTechnologiesUsedByProject(project_filter)
		: await TechnologiesController.getTechnologies();

	resolve.okWith(technologies);
});
