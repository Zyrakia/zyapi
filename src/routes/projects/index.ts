import { ProjectsController } from '@/controllers/projects.controller.ts';
import { Resolve } from '@/utils/resolve.ts';
import { Handler } from 'express';

export const get: Handler = async (req, res) => {
	const technologyFilter = req.query.using;
	if (technologyFilter !== undefined) {
		const technologyId = Number(technologyFilter);
		if (isNaN(technologyId))
			return Resolve(res).badRequest('Invalid technology ID provided as "using" filter.');
		return Resolve(res).okWith(await ProjectsController.getProjectsUsingTechnology(technologyId));
	}

	Resolve(res).okWith(await ProjectsController.getProjects());
};
