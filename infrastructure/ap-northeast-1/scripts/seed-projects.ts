import type { Project } from "./ProjectData";
import { PROJECTS_DATA } from "./ProjectData"; // ESM export

const baseUrl = process.env.PROJECTS_API_BASE_URL;

if (!baseUrl) {
  throw new Error("Environment variable PROJECTS_API_BASE_URL is required.");
}

const projectsEndpoint = `${baseUrl.replace(/\/$/, "")}/projects`;

type CreateProjectPayload = {
  id: Project["id"];
  title: Project["title"];
  summary: Project["summary"];
  techStack: Project["techStack"];
  detail?: Project["detail"];
  metadata: {
    order: number;
    status: string;
  };
};

async function fetchExistingProjects(): Promise<unknown[]> {
  const response = await fetch(projectsEndpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to fetch projects from ${projectsEndpoint}. Status: ${response.status}. Body: ${message}`
    );
  }

  const body = (await response.json()) as { projects?: unknown[] };
  return body.projects ?? [];
}

async function createProjectViaApi(payload: CreateProjectPayload): Promise<void> {
  const response = await fetch(projectsEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to create project ${payload.id} via ${projectsEndpoint}. Status: ${response.status}. Body: ${message}`
    );
  }
}

async function seedProjects(): Promise<void> {
  const existingProjects = await fetchExistingProjects();
  if (existingProjects.length > 0) {
    console.log(
      `API already reports ${existingProjects.length} projects. Skipping seeding process.`
    );
    return;
  }

  console.log(
    `No projects found via API. Seeding ${PROJECTS_DATA.length} project items.`
  );

  for (const [index, project] of PROJECTS_DATA.entries()) {
    const payload: CreateProjectPayload = {
      id: project.id,
      title: project.title,
      summary: project.summary,
      techStack: project.techStack,
      detail: project.detail,
      metadata: {
        order: index + 1,
        status: "PUBLISHED",
      },
    };

    await createProjectViaApi(payload);
    console.log(`Seeded project ${project.id}: ${project.title}`);
  }

  console.log("All project items have been seeded successfully via API.");
}

seedProjects().catch((error) => {
  console.error("Project seeding failed.", error);
  process.exitCode = 1;
});
