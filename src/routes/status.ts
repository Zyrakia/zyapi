import pkg from '../../package.json';
import { documentedRoute } from '@/utils/documented-route.ts';

/**
 * Always responds if the API is available, providing the version of the API.
 */
export const get = documentedRoute<{ version: string }>(async (_, __, resolve) => {
	resolve.okWith({ version: pkg.version }, 'API is available.');
});
