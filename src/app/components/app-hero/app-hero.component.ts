import { Component } from '@angular/core';
import { AppButtonComponent } from '../app-button/app-button.component';
import { NgxDotpatternComponent } from '@omnedia/ngx-dotpattern';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [AppButtonComponent, NgxDotpatternComponent],
  templateUrl: './app-hero.component.html',
  styleUrl: './app-hero.component.scss'
})
export class AppHeroComponent {
  name = 'Akshay Arora';
  subtitle = 'Senior Front-End Engineer';
  description = 'Building enterprise-grade applications with 8+ years of experience in Angular, TypeScript, and JavaScript. Focused on frontend architecture, performance optimization, and team leadership.';

  downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/docs/Resume_AkshayArora_2025.pdf';
    link.download = 'Resume_AkshayArora_2025.pdf';
    link.click();
  }
}
