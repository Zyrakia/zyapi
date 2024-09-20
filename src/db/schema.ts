import { date, pgTable, smallint, smallserial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const ProjectTable = pgTable('project', {
	id: smallserial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	url: text('url'),
	start_date: date('start_date'),
	end_date: date('end_date'),
	logo_url: text('logo_url'),
});

export const InsertProjectSchema = createInsertSchema(ProjectTable).omit({ id: true });

export const TechTable = pgTable('technology', {
	id: smallserial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	url: text('url'),
	logo_url: text('logo_url'),
	skill_level: smallint('skill_level'),
	category: varchar('category', { length: 255 }),
});

export const InsertTechSchema = createInsertSchema(TechTable).omit({ id: true });

export const TechUsageTable = pgTable('technology_usage', {
	project_id: smallserial('project_id').references(() => ProjectTable.id),
	technology_id: smallserial('technology_id').references(() => TechTable.id),
});

export const InsertTechUsageSchema = createInsertSchema(TechUsageTable);

export const UserTable = pgTable('api_user', {
	id: smallserial('id').primaryKey(),
	first_name: text('first_name'),
	last_name: text('last_name'),
	alias: text('alias'),
	website: text('website'),
	avatar_url: text('avatar_url'),
	birthdate: date('birthdate'),
	country: text('country'),
	password: text('password').notNull(),
	bio: text('bio'),
});

export const SocialAccountsTable = pgTable('social_account', {
	user_id: smallserial('user_id').references(() => UserTable.id),
	platform: text('platform').notNull(),
	username: text('username'),
	url: text('url').notNull(),
});
