import express from 'express';
import path from 'node:path';
import { createRouter } from 'express-file-routing';
import { requestLogger } from './middlewares/request-logger.ts';

const app = express();

app.use(requestLogger);

await createRouter(app, {
	directory: path.join(__dirname, 'routes'),
});

const PORT = Number(process.env.PORT);
app.listen({ port: Number(process.env.PORT) }, () => {
	console.log('API running at http://localhost:' + PORT + '.');
});
