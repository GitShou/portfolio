export type ProjectSectionDetail = {
  heading: string;
  body: string;
};

export type ProjectSectionCard = {
  title: string;
  description: string;
};

export type ProjectSection = {
  heading?: string;
  title?: string;
  summary?: string;
  body?: string;
  list?: string[];
  details?: ProjectSectionDetail[];
  image?: string;
  imgURL?: string;
  good?: ProjectSectionCard[];
  more?: ProjectSectionCard[];
};

export type ProjectDetail = {
  type: string;
  pdf?: string;
  role?: string;
  sections: ProjectSection[];
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
  slug?: string | null;
};

export type Project = {
  id: number | string;
  title: string;
  summary: string;
  git?: string;
  techStack: ProjectTech[];
  detail?: ProjectDetail;
  metadata?: ProjectMetadata;
  type?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
