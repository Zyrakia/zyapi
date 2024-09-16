import morgan from 'morgan';
import * as nc from 'recolors';

/**
 * Middleware to log requests with some parameters to the console. Used for
 * debugging and inspection.
 */
export const requestLogger = morgan((tokens, req, res) => {
	const responseCode = res.statusCode;
	const responseTime = parseInt(tokens['total-time'](req, res) || '');
	return `${nc.blue(tokens.method(req, res))} ${nc.bold('@')} ${nc.blue(tokens.url(req, res))} ${nc.bold(
		'|>',
	)} ${
		isNaN(responseCode)
			? nc.strikethrough(nc.red('Response Code'))
			: responseCode < 200
			? nc.blue(responseCode)
			: responseCode < 400
			? nc.green(responseCode)
			: nc.red(responseCode)
	} in ${
		isNaN(responseTime)
			? nc.strikethrough(nc.red('Response Time'))
			: responseTime < 100
			? nc.green(responseTime)
			: responseTime < 150
			? nc.yellow(responseTime)
			: nc.red(responseTime)
	}ms`;
});
