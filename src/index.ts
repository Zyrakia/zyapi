import express from 'express';
import path from 'node:path';
import { createRouter } from 'express-file-routing';
import { requestLogger } from './middlewares/request-logger.ts';
import { env } from './env.ts';

const app = express();

app.use(requestLogger);

await createRouter(app, {
	directory: path.join(__dirname, 'routes'),
});

app.listen({ port: env.PORT }, () => {
	console.log('API running at http://localhost:' + env.PORT + '.');
});
