import { ProjectsController } from '@/controllers/projects.controller.ts';
import { Handler } from 'express';

export const get: Handler = async (req, res) => {
	res.send(await ProjectsController.getProjects());
};
