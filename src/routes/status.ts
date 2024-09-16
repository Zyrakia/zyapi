import { Resolve } from '@/utils/resolve.ts';
import { Handler } from 'express';

import pkg from '../../package.json';

export const get: Handler = (req, res) => {
	Resolve(res).okWith({ version: pkg.version }, 'API is available.');
};
