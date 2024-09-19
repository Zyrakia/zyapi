import { TechnologiesController } from '@/controllers/technologies.controller.ts';
import { Resolve } from '@/utils/resolve.ts';
import { Handler } from 'express';

export const get: Handler = async (req, res) => {
	const projectFilter = req.query.used_by;
	if (projectFilter !== undefined) {
		const projectId = Number(projectFilter);
		if (isNaN(projectId))
			return Resolve(res).badRequest('Invalid project ID provided as a "used by" filter.');
		return Resolve(res).okWith(await TechnologiesController.getTechnologiesUsedByProject(projectId));
	}

	Resolve(res).okWith(await TechnologiesController.getTechnologies());
};
