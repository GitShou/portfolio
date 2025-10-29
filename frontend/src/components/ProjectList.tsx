import { ProjectTechStack } from "./ProjectTechStack";
import { Project } from "@/lib/projects/types";

interface ProjectListProps {
  projects: Project[];
}

const ProjectList = ({ projects }: ProjectListProps) => (
  <div>
    {projects.map((project: Project) => (
      <div key={project.id} className="project-card">
        <h2>{project.title}</h2>
        <p>{project.summary}</p>
        <ProjectTechStack techStack={project.techStack} />
      </div>
    ))}
  </div>
);

export default ProjectList;