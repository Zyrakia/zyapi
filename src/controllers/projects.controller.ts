import { db } from '@/db/index.ts';
import { ProjectTable } from '@/db/schema.ts';
import { eq } from 'drizzle-orm';

/**
 * Responsible for handling all the CRUD operations for the projects table.
 */
export namespace ProjectsController {
	/**
	 * Returns all the projects in the database.
	 */
	export async function getProjects() {
		return await db.select().from(ProjectTable);
	}

	/**
	 * Returns a single project by the ID of the project.
	 *
	 * @param id the ID of the project to be fetched
	 * @returns the project with the given ID, or nothing if the project doesn't exist
	 */
	export async function getProject(id: number) {
		const project = await db.select().from(ProjectTable).where(eq(ProjectTable.id, id));
		if (project.length === 0) return;
		return project[0];
	}

	export async function findProjectByName(name: string) {}
}
