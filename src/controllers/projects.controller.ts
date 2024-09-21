import { db } from '@/db/index.ts';
import { ProjectTable, TechUsageTable } from '@/db/schema.ts';
import { count, eq } from 'drizzle-orm';
import { TechnologiesController } from './technologies.controller.ts';

/**
 * Responsible for handling all the CRUD operations for the projects table.
 */
export namespace ProjectsController {
	/**
	 * Returns all the projects in the database.
	 */
	export async function getProjects() {
		return await db
			.select({
				id: ProjectTable.id,
				name: ProjectTable.name,
				description: ProjectTable.description,
				url: ProjectTable.url,
				start_date: ProjectTable.start_date,
				end_date: ProjectTable.end_date,
				logo_url: ProjectTable.logo_url,
				technologies_referenced: count(TechUsageTable.technology_id),
			})
			.from(ProjectTable)
			.leftJoin(TechUsageTable, eq(TechUsageTable.project_id, ProjectTable.id))
			.groupBy(ProjectTable.id)
			.orderBy(ProjectTable.start_date);
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

	/**
	 * Returns a project with it's technologies, if the project exists.
	 */
	export async function getProjectWithTechnologies(id: number) {
		const project = await ProjectsController.getProject(id);
		if (!project) return;

		const technologies = await TechnologiesController.getTechnologiesUsedByProject(id);
		return { ...project, technologies };
	}

	/**
	 * Returns all the projects that use a specific technology.
	 *
	 * @param technologyId the ID of the technology to get the projects from
	 * @returns the projects that use the specified technology
	 */
	export async function getProjectsUsingTechnology(technologyId: number) {
		return await db
			.select({
				id: ProjectTable.id,
				name: ProjectTable.name,
				description: ProjectTable.description,
				url: ProjectTable.url,
				start_date: ProjectTable.start_date,
				end_date: ProjectTable.end_date,
				logo_url: ProjectTable.logo_url,
			})
			.from(TechUsageTable)
			.innerJoin(ProjectTable, eq(ProjectTable.id, TechUsageTable.project_id))
			.where(eq(TechUsageTable.technology_id, technologyId));
	}
}
