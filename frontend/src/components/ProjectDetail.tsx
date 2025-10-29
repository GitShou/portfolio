import { Project } from "@/lib/projects/types";
import { ProjectTechStack } from "./ProjectTechStack";

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  if (!project) return <div>Not found</div>;

  return (
    <div>
      {/* ...existing code... */}
      <h3>Tech Stack</h3>
      <ProjectTechStack techStack={project.techStack} />
      {/* ...existing code... */}
    </div>
  );
};

export default ProjectDetail;