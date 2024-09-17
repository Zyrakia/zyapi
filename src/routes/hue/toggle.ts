import { HueLightsController } from '@/controllers/hue-lights.controller.ts';
import { Resolve } from '@/utils/resolve.ts';
import { Handler } from 'express';

export const get: Handler = async (_, res) => {
	const bridge = await HueLightsController.getBridge();
	if (!bridge) return Resolve(res).badRequest('Hue is not enabled.');

	const lights = await bridge.Light.allAsGroup();
	await lights.setState({ on: lights.state.any_on ? false : true });

	Resolve(res).ok('Toggled all lights.');
};
