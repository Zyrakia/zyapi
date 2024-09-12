import { ProjectsController } from '@/controllers/projects.controller.ts';
import { Resolve } from '@/utils/resolve.ts';
import { Handler } from 'express';

export const get: Handler = async (req, res) => {
	const id = parseInt(req.params.id);
	if (isNaN(id)) return Resolve(res).badRequest('A project ID must be provided.');

	const includeTechnologies = !!req.query.technologies;

	const project = includeTechnologies
		? await ProjectsController.getProjectWithTechnologies(id)
		: await ProjectsController.getProject(id);
	if (!project) return Resolve(res).notFound('The specified project does not exist.');

	Resolve(res).okWith(project);
};
