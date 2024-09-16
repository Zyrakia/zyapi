import { db } from '@/db/index.ts';
import { SocialAccountsTable, UserTable } from '@/db/schema.ts';
import { compare } from '@/utils/crypto.ts';
import { and, eq, InferSelectModel } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

/**
 * Responsible for handling all the CRUD operations for the users table.
 */
export namespace UsersController {
	/**
	 * A select preset for the users table to only return columns that are safe to
	 * expose to the public.
	 */
	const SAFE_SELECT: { [key in keyof InferSelectModel<typeof UserTable>]?: PgColumn } = {
		first_name: UserTable.first_name,
		last_name: UserTable.last_name,
		alias: UserTable.alias,
		website: UserTable.website,
		avatar_url: UserTable.avatar_url,
		country: UserTable.country,
		birthdate: UserTable.birthdate,
	} as const;

	/**
	 * Returns all users from the database.
	 *
	 * @returns all users from the database
	 */
	export async function getUsers() {
		return db.select(SAFE_SELECT).from(UserTable);
	}

	/**
	 * Returns a user from the database by its ID.
	 *
	 * @param id the ID of the user to retrieve
	 * @returns the user with the given ID, or nothing if the user doesn't exist
	 */
	export async function getUser(id: number) {
		const user = await db.select(SAFE_SELECT).from(UserTable).where(eq(UserTable.id, id));
		if (user.length === 0) return;
		return user[0];
	}

	/**
	 * Returns all social accounts for a user.
	 *
	 * @param id the ID of the user to get the social accounts for
	 * @returns all social accounts for the user
	 */
	export async function getUserSocials(id: number) {
		return db.select().from(SocialAccountsTable).where(eq(SocialAccountsTable.user_id, id));
	}

	/**
	 * Returns a social account for a user, for a specific platform, if it exists.
	 *
	 * @param id the ID of the user to get the social account for
	 * @param platform the platform of the social account to get
	 * @returns the social account for the user and platform, or nothing if it doesn't exist
	 */
	export async function getUserSocial(id: number, platform: string) {
		const social = await db
			.select()
			.from(SocialAccountsTable)
			.where(and(eq(SocialAccountsTable.user_id, id), eq(SocialAccountsTable.platform, platform)));
		if (social.length === 0) return;
		return social[0];
	}

	/**
	 * Returns a user from the database by its ID and password,
	 * this returns all properties of the user, not just the public safe ones.
	 *
	 * @param id the ID of the user to retrieve
	 * @param password the password of the user to check
	 */
	export async function getFullUser(id: number, password: string) {
		const users = await db.select().from(UserTable).where(eq(UserTable.id, id));
		if (users.length === 0) return;

		const user = users[0];
		const hasAccess = await compare(password, user.password);
		if (!hasAccess) return;

		return user;
	}
}
