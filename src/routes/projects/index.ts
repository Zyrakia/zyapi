import { ProjectsController } from '@/controllers/projects.controller.ts';
import { documentedRoute } from '@/utils/documented-route.ts';
import { q } from '@/utils/query.ts';
import { z } from 'zod';

type Response = Awaited<
	ReturnType<typeof ProjectsController.getProjects | typeof ProjectsController.getProjectsUsingTechnology>
>;

/**
 * Returns all entered projects.
 *
 * @query using_technology when specified, returns only the projects that use the technology associated with the specified ID
 */
export const get = documentedRoute<Response>(async (req, _, resolve) => {
	const { using_technology: technologyId } = q(req.query, { using_technology: z.coerce.number() });
	if (technologyId) resolve.okWith(await ProjectsController.getProjectsUsingTechnology(technologyId));
	else resolve.okWith(await ProjectsController.getProjects());
});
