import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss'
})
export class ProjectModalComponent {
  project = input<Project | null>(null);
  isOpen = input(false);
  close = output<void>();

  currentImageIndex = 0;

  closeModal() {
    this.close.emit();
    this.currentImageIndex = 0;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  nextImage() {
    if (this.project() && this.project()?.images) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.project()!.images.length;
    }
  }

  previousImage() {
    if (this.project() && this.project()?.images) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.project()!.images.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
  }

  getMetricsArray(): { key: string; value: string }[] {
    if (!this.project()?.metrics) return [];
    return Object.entries(this.project()!.metrics).map(([key, value]) => ({
      key: key.charAt(0).toUpperCase() + key.slice(1),
      value: String(value)
    }));
  }
}
