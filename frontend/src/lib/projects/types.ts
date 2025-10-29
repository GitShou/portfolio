export type ProjectSection = {
  heading?: string;
  body?: string;
  list?: string[];
  image?: string;
};

export type ProjectImprovement = {
  title: string;
  description: string;
};

export type ProjectDetail = {
  type: string;
  pdf?: string;
  sections: ProjectSection[];
  role?: string;
  tasks?: string[];
  features?: string[];
  architectureUrl?: string;
  improvements?: ProjectImprovement[];
};

export type ProjectTech = {
  name: string;
  icon: string;
};

export type ProjectMetadata = {
  order?: number | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Project = {
  id: number | string;
  title: string;
  summary: string;
  techStack: ProjectTech[];
  detail?: ProjectDetail;
  metadata?: ProjectMetadata;
  type?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
