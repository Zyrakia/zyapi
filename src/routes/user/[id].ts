import { UsersController } from '@/controllers/users.controller.ts';
import { documentedRoute } from '@/utils/documented-route.ts';

const calculateAge = (dob: Date) => {
	const today = new Date();

	let yearDiff = today.getFullYear() - dob.getFullYear();
	const monthDiff = today.getMonth() - dob.getMonth();
	const dayDiff = today.getDate() - dob.getDate();

	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) yearDiff--;

	return yearDiff;
};

type Response = {
	name?: string;
	alias?: string;
	avatar_url?: string;
	bio?: string;
	age?: number;
	location?: string;
	contact: { website?: string } & { [key: string]: string | undefined };
};

/**
 * Returns a user profile for the specified user ID.
 */
export const get = documentedRoute<Response>(async (req, _, resolve) => {
	const userId = parseInt(req.params.id);
	if (isNaN(userId)) return resolve.badRequest('The specified user ID is not a number.');

	const user = await UsersController.getUser(userId);
	if (!user) return resolve.notFound('The specified user was not found.');

	const socials = await UsersController.getUserSocials(userId);

	const includedSocials: Record<string, string> = {};
	socials.forEach((s) => (includedSocials[s.platform.toLowerCase()] = s.url));

	resolve.okWith({
		name: user.first_name ?? undefined,
		alias: user.alias ?? undefined,
		avatar_url: user.avatar_url ?? undefined,
		bio: user.bio ?? undefined,
		age: user.birthdate ? calculateAge(new Date(user.birthdate)) : undefined,
		location: user.country ?? undefined,
		contact: {
			website: user.website ?? undefined,
			...includedSocials,
		},
	});
});
