import { Component } from '@angular/core';
import { AppButtonComponent } from '../app-button/app-button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [AppButtonComponent],
  templateUrl: './app-hero.component.html',
  styleUrl: './app-hero.component.scss'
})
export class AppHeroComponent {
  name = 'Akshay Arora';
  subtitle = 'Senior UI/Front-End Developer';
  description = '8 years of experience building fast, accessible, scalable user interfaces with Angular and modern web technologies.';
}
