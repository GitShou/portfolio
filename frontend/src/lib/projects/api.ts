import { Project } from "./types";

function resolveBaseUrl(): string {
  const baseUrl =
    process.env.PROJECTS_API_BASE_URL ?? process.env.NEXT_PUBLIC_PROJECTS_API_BASE_URL ?? "";
  const normalized = baseUrl.trim();
  if (normalized === "") {
    throw new Error(
      "PROJECTS_API_BASE_URL (or NEXT_PUBLIC_PROJECTS_API_BASE_URL) must be configured for this build."
    );
  }
  return normalized.replace(/\/$/, "");
}

export async function fetchProjects(): Promise<Project[]> {
  const endpoint = `${resolveBaseUrl()}/projects`;
  const response = await fetch(endpoint, {
    cache: "force-cache",
    // 明示的に静的生成対象とするために revalidate 指定を避ける
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch projects. Status: ${response.status}. Body: ${body}`);
  }

  const payload = await response.json();

  if (Array.isArray(payload)) {
    return payload as Project[];
  }

  const data = payload as { projects?: Project[] };
  return data.projects ?? [];
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const projects = await fetchProjects();
  const match = projects.find((project) => String(project.id) === id);
  return match ?? null;
}
