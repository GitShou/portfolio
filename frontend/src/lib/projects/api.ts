import { Project } from "./types";

let fallbackLoader: (() => Promise<Project[]>) | null = null;

if (process.env.NODE_ENV === "development") {
  fallbackLoader = async () => {
    const projectDataModule = await import(
      "../../../../infrastructure/ap-northeast-1/data/ProjectData"
    );
    return projectDataModule.PROJECTS_DATA as Project[];
  };
}

function resolveBaseUrl(): string | null {
  const baseUrl =
    process.env.PROJECTS_API_BASE_URL ?? process.env.NEXT_PUBLIC_PROJECTS_API_BASE_URL ?? null;
  if (!baseUrl || baseUrl.trim() === "") {
    if (fallbackLoader) {
      console.warn("PROJECTS_API_BASE_URL is not defined. Falling back to local ProjectData.ts.");
    }
    return null;
  }
  return baseUrl.replace(/\/$/, "");
}

export async function fetchProjects(): Promise<Project[]> {
  const normalizedBaseUrl = resolveBaseUrl();
  if (!normalizedBaseUrl) {
    if (fallbackLoader) {
      return fallbackLoader();
    }
    throw new Error("PROJECTS_API_BASE_URL must be set for production builds.");
  }

  const endpoint = `${normalizedBaseUrl}/projects`;
  const response = await fetch(endpoint, {
    cache: "force-cache",
    // 明示的に静的生成対象とするために revalidate 指定を避ける
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch projects. Status: ${response.status}. Body: ${body}`);
  }

  const data = (await response.json()) as { projects?: Project[] };
  return data.projects ?? [];
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const normalizedBaseUrl = resolveBaseUrl();
  if (!normalizedBaseUrl) {
    if (fallbackLoader) {
      const fallbackProjects = await fallbackLoader();
      const fallbackMatch = fallbackProjects.find((project) => String(project.id) === id);
      return fallbackMatch ?? null;
    }
    throw new Error("PROJECTS_API_BASE_URL must be set for production builds.");
  }

  const projects = await fetchProjects();
  const match = projects.find((project) => String(project.id) === id);
  return match ?? null;
}
