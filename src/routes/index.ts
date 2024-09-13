import { env } from '@/env.ts';
import { cached } from '@/utils/cache.ts';
import { Resolve } from '@/utils/resolve.ts';
import { Handler } from 'express';
import { z, ZodError } from 'zod';

const GITHUB_INFO_SCHEMA = z.object({
	login: z.string(),
	name: z.string(),
	avatar_url: z.string(),
	url: z.string(),
	blog: z.string(),
	location: z.string(),
	bio: z.string(),
});

const calculateAge = (dob: Date) => {
	const today = new Date();

	let yearDiff = today.getFullYear() - dob.getFullYear();
	const monthDiff = today.getMonth() - dob.getMonth();
	const dayDiff = today.getDate() - dob.getDate();

	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) yearDiff--;

	return yearDiff;
};

export const get: Handler[] = [
	async (_, res) => {
		let githubResponse: unknown;
		try {
			githubResponse = await cached('github-info', '5 minutes', () => {
				return fetch('https://api.github.com/users/zyrakia').then((res) => res.json());
			});
		} catch (err) {
			return Resolve(res).error('GitHub API request failed.');
		}

		let githubInfo: z.infer<typeof GITHUB_INFO_SCHEMA>;
		try {
			githubInfo = GITHUB_INFO_SCHEMA.parse(githubResponse);
		} catch (err) {
			if (err instanceof ZodError)
				return Resolve(res).error(
					'Unable to parse Github API response: ' + err.issues.map((i) => i.message).join(', '),
				);
			else
				return Resolve(res).error('An unknown error occurred while parsing the Github API response.');
		}

		Resolve(res).okWith({
			name: githubInfo.name,
			alias: githubInfo.login,
			avatar_url: githubInfo.avatar_url,
			bio: githubInfo.bio,
			age: calculateAge(env.BIRTHDATE),
			location: githubInfo.location,
			contact: {
				email: 'mail@' + githubInfo.blog,
				website: githubInfo.blog,
				github: githubInfo.url,
				linkedin: 'https://www.linkedin.com/in/ole-lammers/',
				twitter: 'https://twitter.com/zyrakia',
			},
		});
	},
];
