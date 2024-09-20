import { HueLightsController } from '@/controllers/hue-lights.controller.ts';
import { documentedRoute } from '@/utils/documented-route.ts';

/**
 * Returns whether Hue control support is enabled on this server.
 */
export const get = documentedRoute(async (_, __, resolve) => {
	const bridge = await HueLightsController.getBridge();
	if (!bridge) return resolve.badRequest('Hue is not enabled.');
	resolve.ok('Hue is enabled.');
});
