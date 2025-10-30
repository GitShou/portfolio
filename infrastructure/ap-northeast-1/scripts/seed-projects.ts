import type { Project } from "../data/ProjectData";
import { PROJECTS_DATA } from "../data/ProjectData"; // ESM export

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

type ExistingProject = {
  id: Project["id"];
  metadata?: {
    status?: string;
    order?: number | null;
  };
};

async function fetchExistingProjects(): Promise<ExistingProject[]> {
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

  const body = (await response.json()) as { projects?: ExistingProject[] };
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

async function updateProjectViaApi(
  id: Project["id"],
  payload: CreateProjectPayload
): Promise<void> {
  const endpoint = `${projectsEndpoint}/${encodeURIComponent(String(id))}`;
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to update project ${payload.id} via ${endpoint}. Status: ${response.status}. Body: ${message}`
    );
  }
}

async function seedProjects(): Promise<void> {
  const existingProjects = await fetchExistingProjects();
  const existingProjectsById = new Map<string, ExistingProject>();
  for (const project of existingProjects) {
    existingProjectsById.set(String(project.id), project);
  }

  console.log(
    `Upserting ${PROJECTS_DATA.length} project items (existing: ${existingProjects.length}).`
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
        status: existingProjectsById.get(String(project.id))?.metadata?.status ?? "PUBLISHED",
      },
    };

    const existingProject = existingProjectsById.get(String(project.id));

    if (existingProject) {
      await updateProjectViaApi(project.id, payload);
      console.log(`Updated project ${project.id}: ${project.title}`);
    } else {
      await createProjectViaApi(payload);
      console.log(`Created project ${project.id}: ${project.title}`);
    }
  }

  console.log("All project items have been seeded successfully via API.");
}

seedProjects().catch((error) => {
  console.error("Project seeding failed.", error);
  process.exitCode = 1;
});
