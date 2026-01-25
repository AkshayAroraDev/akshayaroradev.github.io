import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ToolbarLink {
  icon: string;
  label: string;
  sectionId: string;
  type: 'navigation' | 'external';
}

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-toolbar.component.html',
  styleUrl: './app-toolbar.component.scss'
})
export class AppToolbarComponent {
  toolbarLinks: ToolbarLink[] = [
    { icon: '⌂', label: 'Home', sectionId: 'hero', type: 'navigation' },
    { icon: '⊕', label: 'Skills', sectionId: 'skills', type: 'navigation' },
    { icon: '▦', label: 'Experience', sectionId: 'timeline', type: 'navigation' },
    { icon: 'in', label: 'LinkedIn', sectionId: 'https://www.linkedin.com/in/akshay-arora-3b25855b/', type: 'external' },
    { icon: '◆', label: 'GitHub', sectionId: 'https://github.com/AkshayAroraDev', type: 'external' },
    { icon: '✉', label: 'Email', sectionId: 'mailto:akshayarora.work@gmail.com', type: 'external' },
    { icon: '📄', label: 'Resume', sectionId: 'resume', type: 'navigation' }
  ];

  scrollToSection(link: ToolbarLink) {
    if (link.type === 'external') {
      if (link.sectionId.startsWith('mailto:')) {
        window.location.href = link.sectionId;
      } else {
        window.open(link.sectionId, '_blank');
      }
    } else {
      if (link.sectionId === 'resume') {
        this.downloadResume();
      } else {
        const element = document.getElementById(link.sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }

  downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/docs/Resume_AkshayArora_2025.pdf';
    link.download = 'Resume_AkshayArora_2025.pdf';
    link.click();
  }
}
