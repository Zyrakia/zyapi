import { date, pgTable, smallint, smallserial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const ProjectTable = pgTable('project', {
	id: smallserial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	url: text('url'),
	start_date: date('start_date'),
	end_date: date('end_date'),
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
