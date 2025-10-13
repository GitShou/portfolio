import { PROJECTS_DATA, Project } from "../lib/data";
import { ProjectTechStack } from "./ProjectTechStack";

const ProjectList = () => (
  <div>
    {PROJECTS_DATA.map((project: Project) => (
      <div key={project.id} className="project-card">
        <h2>{project.title}</h2>
        <p>{project.summary}</p>
        <ProjectTechStack techStack={project.techStack} />
      </div>
    ))}
  </div>
);

export default ProjectList;