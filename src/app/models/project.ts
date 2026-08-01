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

export interface ProjectCardLayoutValues {
  width?: string;
  height?: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  transform?: string;
  hoverTransform?: string;
  galleryHeight?: string;
  contentPadding?: string;
  titleSize?: string;
}

export interface ProjectCardLayout {
  [key: string]: ProjectCardLayoutValues | undefined;
  desktop?: ProjectCardLayoutValues;
  max1200?: ProjectCardLayoutValues;
  max1024?: ProjectCardLayoutValues;
  max900?: ProjectCardLayoutValues;
  max800?: ProjectCardLayoutValues;
  max768?: ProjectCardLayoutValues;
  max767?: ProjectCardLayoutValues;
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
  cardLayout?: ProjectCardLayout;
}
