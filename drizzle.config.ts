import { env } from '@/env.ts';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/schema.ts',
	out: './.drizzle',
	dbCredentials: {
		host: env.POSTGRES_HOST,
		port: Number(env.POSTGRES_PORT),
		user: env.POSTGRES_USER,
		password: env.POSTGRES_PASSWORD,
		database: env.POSTGRES_DATABASE,
		url: '',
	},
});
