import { env } from '@/env.ts';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres({
	host: env.POSTGRES_HOST,
	port: env.POSTGRES_PORT,
	user: env.POSTGRES_USER,
	password: env.POSTGRES_PASSWORD,
	database: env.POSTGRES_DATABASE,
	ssl: 'require',
	connection: {
		options: env.POSTGRES_ENDPOINT_ID ? `project=${env.POSTGRES_ENDPOINT_ID}` : undefined,
	},
});

export const db = drizzle(client);
