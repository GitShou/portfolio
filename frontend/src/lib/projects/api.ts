import { Project, ProjectDetail, ProjectSection } from "./types";

function cloneSections(sections: ProjectSection[]): ProjectSection[] {
  return sections.map((section) => ({
    ...section,
    list: section.list ? [...section.list] : undefined,
    details: section.details ? section.details.map((detail) => ({ ...detail })) : undefined,
    good: section.good ? section.good.map((item) => ({ ...item })) : undefined,
    more: section.more ? section.more.map((item) => ({ ...item })) : undefined,
  }));
}

function cloneDetail(detail: ProjectDetail): ProjectDetail {
  return {
    ...detail,
    sections: cloneSections(detail.sections ?? []),
  };
}

function cloneProject(project: Project): Project {
  return {
    ...project,
    techStack: project.techStack ? project.techStack.map((tech) => ({ ...tech })) : [],
    detail: project.detail ? cloneDetail(project.detail) : undefined,
    metadata: project.metadata ? { ...project.metadata } : undefined,
  };
}

function parseProjectsPayload(payload: unknown): Project[] | null {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload)) {
    return payload as Project[];
  }

  if (typeof payload === "object" && "projects" in payload) {
    const { projects } = payload as { projects?: Project[] };
    return projects ?? null;
  }

  return null;
}

function parseProjectPayload(payload: unknown): Project | null {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload)) {
    return (payload[0] as Project) ?? null;
  }

  if (typeof payload === "object" && payload !== null) {
    if ("project" in payload) {
      const { project } = payload as { project?: Project };
      return project ?? null;
    }
  }

  return payload as Project;
}

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

type SignedFetcher = (url: string, init: RequestInit) => Promise<Response>;

const cachedSignedFetcherByHost = new Map<string, SignedFetcher>();

function normalizeHeaders(input?: HeadersInit): Record<string, string> {
  if (!input) return {};

  if (input instanceof Headers) {
    const headers: Record<string, string> = {};
    input.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }

  if (Array.isArray(input)) {
    return Object.fromEntries(input.map(([key, value]) => [key, value]));
  }

  return { ...input };
}

async function getSignedFetcherForHost(hostname: string): Promise<SignedFetcher> {
  if (cachedSignedFetcherByHost.has(hostname)) {
    return cachedSignedFetcherByHost.get(hostname)!;
  }

  if (typeof window !== "undefined") {
    return fetch;
  }

  if (!hostname.includes(".execute-api.")) {
    const passthroughFetcher: SignedFetcher = (url, init) => fetch(url, init);
    cachedSignedFetcherByHost.set(hostname, passthroughFetcher);
    return passthroughFetcher;
  }

  const region = extractRegionFromHostname(hostname);
  const [{ SignatureV4 }, { HttpRequest }, { defaultProvider }, { Sha256 }] = await Promise.all([
    import("@aws-sdk/signature-v4"),
    import("@aws-sdk/protocol-http"),
    import("@aws-sdk/credential-provider-node"),
    import("@aws-crypto/sha256-js"),
  ]);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region,
    service: "execute-api",
    sha256: Sha256,
  });

  const signedFetcher: SignedFetcher = async (url, init) => {
    const targetUrl = new URL(url);
    const headers = normalizeHeaders(init.headers);

    const request = new HttpRequest({
      protocol: targetUrl.protocol,
      hostname: targetUrl.hostname,
      port: targetUrl.port ? Number(targetUrl.port) : undefined,
      method: init.method ?? "GET",
      path: `${targetUrl.pathname}${targetUrl.search}`,
      headers: {
        host: targetUrl.host,
        ...headers,
      },
      body: typeof init.body === "string" ? init.body : undefined,
    });

    const signed = await signer.sign(request);
    const signedHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(signed.headers)) {
      if (typeof value === "string") {
        signedHeaders[key] = value;
      }
    }

    return fetch(targetUrl, {
      ...init,
      headers: signedHeaders,
    });
  };

  cachedSignedFetcherByHost.set(hostname, signedFetcher);
  return signedFetcher;
}

async function invokeApi(endpoint: string, init: RequestInit): Promise<Response> {
  if (typeof window !== "undefined") {
    return fetch(endpoint, init);
  }

  const url = new URL(endpoint);
  const signedFetcher = await getSignedFetcherForHost(url.hostname);
  return signedFetcher(endpoint, init);
}

export async function fetchProjects(): Promise<Project[]> {
  const endpoint = `${resolveBaseUrl()}/projects`;
  const response = await invokeApi(endpoint, {
    cache: "force-cache",
    // 明示的に静的生成対象とするために revalidate 指定を避ける
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch projects. Status: ${response.status}. Body: ${body}`);
  }

  const payload = await response.json();
  const remoteProjects = parseProjectsPayload(payload);

  if (!remoteProjects) {
    throw new Error("Projects API returned an empty payload.");
  }

  return remoteProjects.map((project) => cloneProject(project));
}

export async function fetchProjectById(id: string | number): Promise<Project | null> {
  const stringId = String(id);

  const endpoint = `${resolveBaseUrl()}/projects/${encodeURIComponent(stringId)}`;
  const response = await invokeApi(endpoint, {
    cache: "force-cache",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch project detail. Status: ${response.status}. Body: ${body}`);
  }

  const payload = await response.json();
  const project = parseProjectPayload(payload);

  if (!project) {
    return null;
  }

  return cloneProject(project);
}
