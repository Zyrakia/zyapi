import * as rc from 'recolors';

/**
 * Logs something to the console with a context prefix.
 *
 * @param context the context to log with
 * @param message the message to log
 */
export function log(context: string, message: string) {
	console.log(rc.bold(rc.yellow(context)), message);
}

/**
 * Creates a log function that always logs with the given context.
 *
 * @param context the context to log with
 * @returns the context-bound log function
 */
export const logger = (context: string) => (message: string) => log(context, message);
