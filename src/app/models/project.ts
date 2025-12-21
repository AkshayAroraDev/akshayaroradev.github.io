export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectMetrics {
  [key: string]: string | number | undefined;
}

export interface ProjectLinks {
  [key: string]: string;
}

export interface Project {
  id: number;
  title: string;
  company: string;
  description: string;
  role: string;
  period: string;
  technologies: string[];
  highlights: string[];
  images: ProjectImage[];
  links: ProjectLinks;
  metrics: ProjectMetrics;
}
