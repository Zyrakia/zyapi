import express from 'express';
import path from 'node:path';
import { createRouter } from 'express-file-routing';
import { requestLogger } from './middlewares/request-logger.ts';
import { env } from './env.ts';
import { logger } from './utils/log.ts';

const log = logger('[Server]');
const app = express();

app.use(requestLogger);

await createRouter(app, {
	directory: path.join(__dirname, 'routes'),
});

app.listen({ port: env.PORT }, () => {
	log('API running at http://localhost:' + env.PORT);
});
