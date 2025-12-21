import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import projectsData from '@src/json/projects.json';

interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
}

interface ProjectMetrics {
  [key: string]: string | number | undefined;
}

interface ProjectLinks {
  [key: string]: string;
}

interface Project {
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

interface ProjectsData {
  projects: Array<Record<string, any>>;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-projects.component.html',
  styleUrl: './app-projects.component.scss'
})
export class AppProjectsComponent implements AfterViewInit {
  projects: Project[] = ((projectsData as unknown) as ProjectsData).projects as Project[];
  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.addEventListener('wheel', (e: WheelEvent) => {
        e.preventDefault();
        this.carouselContainer.nativeElement.scrollLeft += e.deltaY > 0 ? 100 : -100;
      }, { passive: false });
    }
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
