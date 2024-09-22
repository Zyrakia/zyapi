import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {
		PORT: z.coerce.number().default(3000),
		POSTGRES_HOST: z.string().default('localhost'),
		POSTGRES_PORT: z.number().default(5432),
		POSTGRES_USER: z.string().default('postgres'),
		POSTGRES_PASSWORD: z.string(),
		POSTGRES_DATABASE: z.string(),
		POSTGRES_ENDPOINT_ID: z.string().optional(),
		HUE_IP: z.string().optional(),
		HUE_USER: z.string().optional(),
	},
	emptyStringAsUndefined: true,
	runtimeEnv: process.env,
});
