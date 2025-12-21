import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectsData } from '@src/app/models';
import projectsData from '@src/json/projects.json';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-projects.component.html',
  styleUrl: './app-projects.component.scss'
})
export class AppProjectsComponent implements AfterViewInit {
  projects: Project[] = ((projectsData as unknown) as ProjectsData).projects as Project[];
  draggedElement: HTMLElement | null = null;
  offsetX: number = 0;
  offsetY: number = 0;

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
