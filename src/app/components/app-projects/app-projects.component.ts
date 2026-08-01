import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectCardLayoutValues, ProjectsData } from '../../models';
import projectsData from '../../../json/projects.json';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { CharMagnifyDirective } from '../../directives/proximity-magnify.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectModalComponent, CharMagnifyDirective],
  templateUrl: './app-projects.component.html',
  styleUrl: './app-projects.component.scss'
})
export class AppProjectsComponent implements AfterViewInit {
  projects: Project[] = ((projectsData as unknown) as ProjectsData).projects as Project[];
  draggedElement: HTMLElement | null = null;
  offsetX: number = 0;
  offsetY: number = 0;
  selectedProject: Project | null = null;
  isModalOpen: boolean = false;
  isDragging: boolean = false;

  ngAfterViewInit() {
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
    this.isDragging = false;
    this.draggedElement = card;
    const container = card.parentElement;
    
    if (!container) return;
    
    const rect = card.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Get current position relative to container
    const currentLeft = card.offsetLeft || 0;
    const currentTop = card.offsetTop || 0;
    
    // Calculate offset relative to container, not viewport
    this.offsetX = e.clientX - containerRect.left - currentLeft;
    this.offsetY = e.clientY - containerRect.top - currentTop;
    
    card.style.position = 'absolute';
    card.style.left = currentLeft + 'px';
    card.style.top = currentTop + 'px';
    card.classList.add('dragging');
  }

  onMouseMove(e: MouseEvent) {
    if (!this.draggedElement) return;

    // Mark as dragging if mouse moved more than a few pixels
    this.isDragging = true;

    const container = this.draggedElement.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    let x = e.clientX - containerRect.left - this.offsetX;
    let y = e.clientY - containerRect.top - this.offsetY;

    // Constrain within container
    x = Math.max(0, Math.min(x, containerRect.width - this.draggedElement.offsetWidth));
    y = Math.max(0, Math.min(y, containerRect.height - this.draggedElement.offsetHeight));

    this.draggedElement.style.left = x + 'px';
    this.draggedElement.style.top = y + 'px';
  }

  onMouseUp() {
    if (this.draggedElement) {
      this.draggedElement.classList.remove('dragging');
      // Add smooth settle animation
      this.draggedElement.style.transition = 'box-shadow 0.2s ease-out';
      setTimeout(() => {
        if (this.draggedElement) {
          this.draggedElement.style.transition = '';
        }
      }, 200);
      
      this.draggedElement = null;
    }
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  openProjectModal(project: Project) {
    // Only open modal if not dragging
    if (!this.isDragging) {
      this.selectedProject = project;
      this.isModalOpen = true;
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProject = null;
    // Restore body scroll
    document.body.style.overflow = '';
  }

  getCardStyleVars(project: Project): Record<string, string> {
    const styles: Record<string, string> = {};
    const layout = project.cardLayout;

    if (!layout) {
      return styles;
    }

    this.applyLayoutSet(styles, '', layout.desktop);
    this.applyLayoutSet(styles, '-1200', layout.max1200);
    this.applyLayoutSet(styles, '-1024', layout.max1024);
    this.applyLayoutSet(styles, '-900', layout.max900);
    this.applyLayoutSet(styles, '-800', layout.max800);
    this.applyLayoutSet(styles, '-768', layout.max768);
    this.applyLayoutSet(styles, '-767', layout.max767);

    return styles;
  }

  private applyLayoutSet(
    styles: Record<string, string>,
    suffix: string,
    layout?: ProjectCardLayoutValues
  ) {
    if (!layout) {
      return;
    }

    this.applyStyleVar(styles, `--card-width${suffix}`, layout.width);
    this.applyStyleVar(styles, `--card-height${suffix}`, layout.height);
    this.applyStyleVar(styles, `--card-left${suffix}`, layout.left);
    this.applyStyleVar(styles, `--card-right${suffix}`, layout.right);
    this.applyStyleVar(styles, `--card-top${suffix}`, layout.top);
    this.applyStyleVar(styles, `--card-bottom${suffix}`, layout.bottom);
    this.applyStyleVar(styles, `--card-transform${suffix}`, layout.transform);
    this.applyStyleVar(styles, `--card-hover-transform${suffix}`, layout.hoverTransform);
    this.applyStyleVar(styles, `--card-gallery-height${suffix}`, layout.galleryHeight);
    this.applyStyleVar(styles, `--card-content-padding${suffix}`, layout.contentPadding);
    this.applyStyleVar(styles, `--card-title-size${suffix}`, layout.titleSize);
  }

  private applyStyleVar(styles: Record<string, string>, key: string, value?: string) {
    if (value) {
      styles[key] = value;
    }
  }
}
