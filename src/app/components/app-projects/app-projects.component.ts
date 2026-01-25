import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectsData } from '../../models';
import projectsData from '../../../json/projects.json';
import { ProjectModalComponent } from '../project-modal/project-modal.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectModalComponent],
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
}
