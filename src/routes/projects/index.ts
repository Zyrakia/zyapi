import { ProjectsController } from '@/controllers/projects.controller.ts';
import { Resolve } from '@/utils/resolve.ts';
import { Handler } from 'express';

export const get: Handler = async (_, res) => {
	Resolve(res).okWith(await ProjectsController.getProjects());
};
