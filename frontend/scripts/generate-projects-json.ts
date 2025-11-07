import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  PROJECTS_DATA,
  type Project,
  type ProjectDetail,
  type ProjectSection,
  type ProjectSectionCard,
  type ProjectSectionDetail,
} from "../../infrastructure/ap-northeast-1/data/ProjectData";

function normalizeText(value?: string | null): string | undefined {
  if (value === undefined || value === null) return value ?? undefined;
  const normalized = value.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
  return normalized;
}

function normalizeSectionDetail(detail: ProjectSectionDetail): ProjectSectionDetail {
  return {
    ...detail,
    heading: normalizeText(detail.heading) ?? detail.heading,
    body: normalizeText(detail.body) ?? detail.body,
  };
}

function normalizeSectionCard(card: ProjectSectionCard): ProjectSectionCard {
  return {
    ...card,
    title: normalizeText(card.title) ?? card.title,
    description: normalizeText(card.description) ?? card.description,
  };
}

function normalizeSection(section: ProjectSection): ProjectSection {
  return {
    ...section,
    heading: normalizeText(section.heading) ?? section.heading,
    title: normalizeText(section.title) ?? section.title,
    summary: normalizeText(section.summary) ?? section.summary,
    body: normalizeText(section.body) ?? section.body,
    list: section.list ? section.list.map((item) => normalizeText(item) ?? item) : undefined,
    details: section.details ? section.details.map(normalizeSectionDetail) : undefined,
    good: section.good ? section.good.map(normalizeSectionCard) : undefined,
    more: section.more ? section.more.map(normalizeSectionCard) : undefined,
  };
}

function normalizeDetail(detail: ProjectDetail): ProjectDetail {
  return {
    ...detail,
    type: normalizeText(detail.type) ?? detail.type,
    pdf: normalizeText(detail.pdf) ?? detail.pdf,
    role: normalizeText(detail.role) ?? detail.role,
    sections: detail.sections ? detail.sections.map(normalizeSection) : [],
  };
}

function normalizeProject(project: Project): Project {
  return {
    ...project,
    title: normalizeText(project.title) ?? project.title,
    summary: normalizeText(project.summary) ?? project.summary,
    git: normalizeText(project.git) ?? project.git,
    techStack: project.techStack.map((tech) => ({
      ...tech,
      name: normalizeText(tech.name) ?? tech.name,
      icon: normalizeText(tech.icon) ?? tech.icon,
    })),
    detail: project.detail ? normalizeDetail(project.detail) : undefined,
  };
}

async function main() {
  const outputPath = resolve(process.cwd(), "mocks", "projects.json");
  const normalizedProjects = PROJECTS_DATA.map(normalizeProject);
  const payload = { projects: normalizedProjects };
  const contents = `${JSON.stringify(payload, null, 2)}\n`;
  await writeFile(outputPath, contents, { encoding: "utf8" });
  console.log(`Generated ${payload.projects.length} projects -> ${outputPath}`);
}

main().catch((error) => {
  console.error("Failed to generate projects.json", error);
  process.exitCode = 1;
});
