import { UsersController } from '@/controllers/users.controller.ts';
import { Resolve } from '@/utils/resolve.ts';
import { Handler } from 'express';

const calculateAge = (dob: Date) => {
	const today = new Date();

	let yearDiff = today.getFullYear() - dob.getFullYear();
	const monthDiff = today.getMonth() - dob.getMonth();
	const dayDiff = today.getDate() - dob.getDate();

	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) yearDiff--;

	return yearDiff;
};

export const get: Handler = async (req, res) => {
	const userId = Number(req.params.id);
	if (isNaN(userId)) Resolve(res).badRequest('The specified user ID is not a number.');

	const user = await UsersController.getUser(userId);
	if (!user) return Resolve(res).notFound('The specified user was not found.');

	const socials = await UsersController.getUserSocials(userId);

	const includedSocials: Record<string, string> = {};
	socials.forEach((s) => (includedSocials[s.platform.toLowerCase()] = s.url));

	Resolve(res).okWith({
		name: user.first_name,
		alias: user.alias,
		avatar_url: user.avatar_url,
		bio: user.bio,
		age: user.birthdate ? calculateAge(new Date(user.birthdate)) : null,
		location: user.country,
		contact: {
			website: user.website ?? undefined,
			...includedSocials,
		},
	});
};
