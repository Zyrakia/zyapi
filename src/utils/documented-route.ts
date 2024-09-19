import { Handler, Request, Response } from 'express';
import { Resolve, Resolver } from './resolve.ts';

/**
 * Utility function to create a route that has a typed resolver automatically
 * provided. This is used to extract route details automatically with the Typescript compiler API.
 *
 * @param handler the route handler
 * @param middlewares the middlewares to apply to the route
 * @returns the route handler
 */
export function documentedRoute<ValidResult = any, BodyType = any>(
	handler: (req: Request, res: Response, resolver: Resolver<ValidResult>) => void,
	middlewares: Handler[] = [],
): Handler[] {
	return [...middlewares, (req, res) => handler(req, res, Resolve<ValidResult>(res))];
}
