import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGridpatternComponent } from '@omnedia/ngx-gridpattern';
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
  imports: [CommonModule, NgxGridpatternComponent],
  templateUrl: './app-projects.component.html',
  styleUrl: './app-projects.component.scss'
})
export class AppProjectsComponent implements AfterViewInit {
  projects: Project[] = ((projectsData as unknown) as ProjectsData).projects as Project[];
  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLDivElement>;
  draggedElement: HTMLElement | null = null;
  offsetX: number = 0;
  offsetY: number = 0;

  ngAfterViewInit() {
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.addEventListener('wheel', (e: WheelEvent) => {
        e.preventDefault();
        this.carouselContainer.nativeElement.scrollLeft += e.deltaY > 0 ? 100 : -100;
      }, { passive: false });
    }
    // Only enable drag-and-drop on desktop (window width >= 768px)
    if (window.innerWidth >= 768) {
      this.setupDragAndDrop();
    }
  }

  setupDragAndDrop() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
      card.addEventListener('mousedown', (e: any) => this.onMouseDown(e, card as HTMLElement));
    });

    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', () => this.onMouseUp());
  }

  onMouseDown(e: MouseEvent, card: HTMLElement) {
    this.draggedElement = card;
    const rect = card.getBoundingClientRect();
    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;
    card.classList.add('dragging');
  }

  onMouseMove(e: MouseEvent) {
    if (!this.draggedElement) return;

    const container = this.draggedElement.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    let x = e.clientX - containerRect.left - this.offsetX;
    let y = e.clientY - containerRect.top - this.offsetY;

    // Constrain within container
    x = Math.max(0, Math.min(x, containerRect.width - this.draggedElement.offsetWidth));
    y = Math.max(0, Math.min(y, containerRect.height - this.draggedElement.offsetHeight));

    this.draggedElement.style.position = 'absolute';
    this.draggedElement.style.left = x + 'px';
    this.draggedElement.style.top = y + 'px';
  }

  onMouseUp() {
    if (this.draggedElement) {
      this.draggedElement.classList.remove('dragging');
      this.draggedElement = null;
    }
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
