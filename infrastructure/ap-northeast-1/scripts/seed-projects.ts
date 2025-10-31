import type { Project } from "../data/ProjectData";
import { PROJECTS_DATA } from "../data/ProjectData"; // ESM export
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

const baseUrl = process.env.PROJECTS_API_BASE_URL;

if (!baseUrl) {
  throw new Error("Environment variable PROJECTS_API_BASE_URL is required.");
}

const projectsEndpoint = `${baseUrl.replace(/\/$/, "")}/projects`;
const projectsEndpointUrl = new URL(projectsEndpoint);
const shouldSignRequests = projectsEndpointUrl.hostname.includes(".execute-api.");

function extractRegionFromHostname(hostname: string): string {
  const parts = hostname.split(".");
  const executeApiIndex = parts.indexOf("execute-api");

  if (executeApiIndex === -1 || executeApiIndex + 1 >= parts.length) {
    throw new Error(
      `Unable to parse AWS region from API hostname: ${hostname}. Expected '<apiId>.execute-api.<region>.amazonaws.com'.`
    );
  }

  return parts[executeApiIndex + 1];
}

const signer = shouldSignRequests
  ? new SignatureV4({
      credentials: defaultProvider(),
      region: extractRegionFromHostname(projectsEndpointUrl.hostname),
      service: "execute-api",
      sha256: Sha256,
    })
  : null;

async function signedFetch(
  url: string,
  init: { method: string; body?: string; headers?: Record<string, string> }
): Promise<Response> {
  if (!shouldSignRequests || !signer) {
    return fetch(url, {
      method: init.method,
      headers: init.headers,
      body: init.body,
    });
  }

  const targetUrl = new URL(url);

  const request = new HttpRequest({
    protocol: targetUrl.protocol,
    hostname: targetUrl.hostname,
    port: targetUrl.port ? Number(targetUrl.port) : undefined,
    method: init.method,
    path: `${targetUrl.pathname}${targetUrl.search}`,
    headers: {
      host: targetUrl.host,
      ...(init.headers ?? {}),
    },
    body: init.body,
  });

  const signed = await signer.sign(request);
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(signed.headers)) {
    if (typeof value === "string") {
      headers[key] = value;
    }
  }

  return fetch(targetUrl, {
    method: init.method,
    headers,
    body: init.body,
  });
}

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
  const response = await signedFetch(projectsEndpoint, {
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
  const response = await signedFetch(projectsEndpoint, {
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
  const response = await signedFetch(endpoint, {
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
