import { PROJECTS_DATA } from "../lib/data";
import { ProjectTechStack } from "./ProjectTechStack";

// プロジェクト詳細表示例
type ProjectDetailProps = {
  projectId: string; // ← string型にしておく
};

const ProjectDetail = ({ projectId }: ProjectDetailProps) => {
  const project = PROJECTS_DATA.find(p => String(p.id) === projectId);
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