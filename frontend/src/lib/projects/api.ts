import projectsSeed from "../../../mocks/projects.json" assert { type: "json" };
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

const RAW_STATIC_PROJECTS_DATA = projectsSeed.projects as unknown as Project[];

function buildStaticProjects(): Project[] {
  return RAW_STATIC_PROJECTS_DATA.map((project) => cloneProject(project));
}

const staticProjectsCache = buildStaticProjects();

function getStaticProjects(): Project[] {
  return staticProjectsCache.map((project) => cloneProject(project));
}

function mergeDetail(primary?: ProjectDetail, fallback?: ProjectDetail): ProjectDetail | undefined {
  if (!primary && !fallback) {
    return undefined;
  }

  if (!primary) {
    return fallback ? cloneDetail(fallback) : undefined;
  }

  if (!fallback) {
    return cloneDetail(primary);
  }

  const fallbackClone = cloneDetail(fallback);
  const primaryClone = cloneDetail(primary);
  const merged: ProjectDetail = { ...fallbackClone, ...primaryClone };

  const primarySections = primaryClone.sections ?? [];
  const fallbackSections = fallbackClone.sections ?? [];
  const sectionsToUse =
    primarySections.length >= fallbackSections.length ? primarySections : fallbackSections;

  merged.sections = cloneSections(sectionsToUse);
  return merged;
}

function mergeProjectWithFallback(primary: Project, fallback?: Project): Project {
  if (!fallback) {
    return cloneProject(primary);
  }

  const fallbackClone = cloneProject(fallback);
  const primaryClone = cloneProject(primary);

  return {
  ...fallbackClone,
  ...primaryClone,
  id: fallbackClone.id,
    techStack: primaryClone.techStack && primaryClone.techStack.length > 0
      ? primaryClone.techStack
      : fallbackClone.techStack,
    detail: mergeDetail(primaryClone.detail, fallbackClone.detail),
  };
}

function normalizeKey(value: string | number | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  const normalized = String(value).trim().toLowerCase();
  return normalized === "" ? null : normalized;
}

function normalizeTitle(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return normalized === "" ? null : normalized;
}

function normalizeType(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return normalized === "" ? null : normalized;
}

function computeMatchScore(fallbackProject: Project, candidate: Project): number {
  let score = 0;

  const fallbackIdKey = normalizeKey(fallbackProject.id);
  const fallbackSlugKey = normalizeKey(fallbackProject.metadata?.slug ?? null);
  const fallbackTitleKey = normalizeTitle(fallbackProject.title);
  const fallbackTypeKey = normalizeType(fallbackProject.detail?.type ?? fallbackProject.type ?? null);

  const candidateIdKey = normalizeKey(candidate.id);
  const candidateSlugKey = normalizeKey(candidate.metadata?.slug ?? null);
  const candidateTitleKey = normalizeTitle(candidate.title);
  const candidateTypeKey = normalizeType(candidate.detail?.type ?? candidate.type ?? null);

  if (candidateIdKey && fallbackIdKey && candidateIdKey === fallbackIdKey) {
    score += 100;
  }

  if (candidateIdKey && fallbackSlugKey && candidateIdKey === fallbackSlugKey) {
    score += 95;
  }

  if (candidateSlugKey && fallbackIdKey && candidateSlugKey === fallbackIdKey) {
    score += 90;
  }

  if (candidateSlugKey && fallbackSlugKey && candidateSlugKey === fallbackSlugKey) {
    score += 85;
  }

  if (candidateTitleKey && fallbackTitleKey && candidateTitleKey === fallbackTitleKey) {
    score += 80;
  }

  if (candidateTypeKey && fallbackTypeKey && candidateTypeKey === fallbackTypeKey) {
    score += 60;
  }

  if (candidate.summary && fallbackProject.summary && candidate.summary === fallbackProject.summary) {
    score += 20;
  }

  return score;
}

function pickRemoteMatch(fallbackProject: Project, candidates: Project[]): Project | undefined {
  if (candidates.length === 0) {
    return undefined;
  }

  let bestIndex = -1;
  let bestScore = 0;

  candidates.forEach((candidate, index) => {
    const score = computeMatchScore(fallbackProject, candidate);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  if (bestIndex === -1) {
    return undefined;
  }

  const minimumScore = 60;
  if (bestScore < minimumScore) {
    return undefined;
  }

  const [match] = candidates.splice(bestIndex, 1);
  return match;
}

function mergeProjectLists(remote: Project[] | null, fallback: Project[]): Project[] {
  const remotePool = remote ? remote.map((project) => cloneProject(project)) : [];

  const merged = fallback.map((fallbackProject) => {
    const remoteMatch = pickRemoteMatch(fallbackProject, remotePool);
    if (remoteMatch) {
      return mergeProjectWithFallback(remoteMatch, fallbackProject);
    }
    return cloneProject(fallbackProject);
  });

  remotePool.forEach((remaining) => {
    merged.push(cloneProject(remaining));
  });

  return merged;
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
  const fallbackProjects = getStaticProjects();

  try {
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
    return mergeProjectLists(remoteProjects, fallbackProjects);
  } catch {
    return fallbackProjects;
  }
}

export async function fetchProjectById(id: string | number): Promise<Project | null> {
  const stringId = String(id);
  const fallbackProjects = getStaticProjects();
  const fallback = fallbackProjects.find((project) => String(project.id) === stringId);

  try {
    const endpoint = `${resolveBaseUrl()}/projects/${encodeURIComponent(stringId)}`;
    const response = await invokeApi(endpoint, {
      cache: "force-cache",
    });

    if (response.status === 404) {
      return fallback ? cloneProject(fallback) : null;
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Failed to fetch project detail. Status: ${response.status}. Body: ${body}`
      );
    }

    const payload = await response.json();
    const project = parseProjectPayload(payload);

    if (!project) {
      return fallback ? cloneProject(fallback) : null;
    }

    return mergeProjectWithFallback(project, fallback);
  } catch {
    if (fallback) {
      return cloneProject(fallback);
    }

    const projects = await fetchProjects();
    const match = projects.find((project) => String(project.id) === stringId);
    return match ?? null;
  }
}
