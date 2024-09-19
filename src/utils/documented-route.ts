import { Handler, Request, Response } from 'express';
import { Resolve, Resolver } from './resolve.ts';

/**
 * Utility function to create a route that has a typed resolver automatically
 * provided. This is used to extract route details automatically with the Typescript compiler API.
 *
 * @param handler the route handler
 * @param middlewares the middlewares to apply to the route
 * @returns the route handler
 * @template ResponseType the result returned by the route when a successful response is returned, enforced in the resolver
 * @template BodyType the expected type of the request body, only for reflection purposes
 */
export function documentedRoute<ResponseType = any, BodyType = any>(
	handler: (req: Request, res: Response, resolver: Resolver<ResponseType>) => void,
	middlewares: Handler[] = [],
): Handler[] {
	return [...middlewares, (req, res) => handler(req, res, Resolve<ResponseType>(res))];
}
