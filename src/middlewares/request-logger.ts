import morgan from 'morgan';
import * as rc from 'recolors';

/**
 * Middleware to log requests with some parameters to the console. Used for
 * debugging and inspection.
 */
export const requestLogger = morgan((tokens, req, res) => {
	const responseCode = res.statusCode;
	const responseTime = parseInt(tokens['total-time'](req, res) || '');
	return `${rc.blue(tokens.method(req, res))} ${rc.bold('@')} ${rc.blue(tokens.url(req, res))} ${rc.bold(
		'|>',
	)} ${
		isNaN(responseCode)
			? rc.strikethrough(rc.red('Response Code'))
			: responseCode < 200
			? rc.blue(responseCode)
			: responseCode < 400
			? rc.green(responseCode)
			: rc.red(responseCode)
	} in ${
		isNaN(responseTime)
			? rc.strikethrough(rc.red('Response Time'))
			: responseTime < 100
			? rc.green(responseTime)
			: responseTime < 150
			? rc.yellow(responseTime)
			: rc.red(responseTime)
	}ms`;
});
