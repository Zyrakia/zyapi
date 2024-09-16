import { Handler } from 'express';

const DEFAULT_USER_ID = 1;

export const get: Handler[] = [
	async (_, res) => {
		res.redirect(`/user/${DEFAULT_USER_ID}`);
	},
];
