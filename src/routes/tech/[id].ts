import { TechnologiesController } from '@/controllers/technologies.controller.ts';
import { Resolve } from '@/utils/resolve.ts';
import { Handler } from 'express';

export const get: Handler = async (req, res) => {
	const id = Number(req.params.id);
	if (isNaN(id)) return Resolve(res).badRequest('The specified technology ID is not a valid number.');

	const withProjects = !!req.query.projects;

	let technology = withProjects
		? await TechnologiesController.getTechnologyWithProjects(id)
		: await TechnologiesController.getTechnology(id);

	if (!technology) return Resolve(res).notFound('The specified technology does not exist.');
	Resolve(res).okWith(technology);
};
