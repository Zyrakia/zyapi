import { ProjectsController } from '@/controllers/projects.controller.ts';
import { Resolve } from '@/utils/resolve.ts';
import { Handler } from 'express';

export const get: Handler = async (req, res) => {
	const id = Number(req.params.id);
	if (isNaN(id)) return Resolve(res).badRequest('The specified project ID is not a valid number.');

	const withTechnologies = !!req.query.technologies;

	let project = withTechnologies
		? await ProjectsController.getProjectWithTechnologies(id)
		: await ProjectsController.getProject(id);

	if (!project) return Resolve(res).notFound('The specified project does not exist.');
	Resolve(res).okWith(project);
};
