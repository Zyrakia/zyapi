import { db } from '@/db/index.ts';
import { TechTable, TechUsageTable } from '@/db/schema.ts';
import { eq, inArray } from 'drizzle-orm';

/**
 * Responsible for handling all the CRUD operations for the technologies table.
 */
export namespace TechnologiesController {
	/**
	 * Returns all the technologies in the database, optionally filtered by an array of IDs.
	 *
	 * @param ids an array of IDs to filter the technologies by
	 * @returns the queried technologies
	 */
	export async function getTechnologies(ids?: number[]) {
		if (ids === undefined) return await db.select().from(TechTable);
		return await db.select().from(TechTable).where(inArray(TechTable.id, ids));
	}

	/**
	 * Returns all the technologies used in a project.
	 *
	 * @param projectId the ID of the project to get the technologies from
	 * @returns the technologies used in the project
	 */
	export async function getProjectTechnologies(projectId: number) {
		return await db
			.select({
				id: TechTable.id,
				name: TechTable.name,
				url: TechTable.url,
				logo_url: TechTable.logo_url,
				skill_level: TechTable.skill_level,
				category: TechTable.category,
			})
			.from(TechTable)
			.innerJoin(TechUsageTable, eq(TechTable.id, TechUsageTable.technology_id))
			.where(eq(TechUsageTable.project_id, projectId));
	}

	/**
	 * Returns a single technology by the ID of the technology.
	 *
	 * @param id the ID of the technology to be fetched
	 * @returns the technology with the given ID, or nothing if the technology doesn't exist
	 */
	export async function getTechnology(id: number) {
		const technology = await db.select().from(TechTable).where(eq(TechTable.id, id));
		if (technology.length === 0) return;
		return technology[0];
	}
}
