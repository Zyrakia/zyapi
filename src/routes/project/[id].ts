import { ProjectsController } from '@/controllers/projects.controller.ts';
import { Resolve } from '@/utils/resolve.ts';
import { Handler } from 'express';

export const get: Handler = async (req, res) => {
	const id = Number(req.params.id);
	if (isNaN(id)) return Resolve(res).badRequest('Invalid project ID provided.');

	const project = await ProjectsController.getProject(id);
	if (!project) return Resolve(res).notFound('Project with the given ID does not exist.');

	Resolve(res).okWith(project);
};
