import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface IconAttribution {
  name: string;
  artist: string;
  source: string;
  link: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss'
})
export class AppFooterComponent {
  currentYear = new Date().getFullYear();
  
  iconAttributions: IconAttribution[] = [
    // Add your icon attributions here
    // Example:
    // {
    //   name: 'Angular Icon',
    //   artist: 'Artist Name',
    //   source: 'Flaticon',
    //   link: 'https://www.flaticon.com/free-icon/angular_...'
    // }
  ];

  socialLinks = [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/akshay-arora-3b25855b/', icon: 'in' },
    { label: 'GitHub', url: 'https://github.com/F4C3L3SS', icon: 'github' },
    { label: 'Email', url: 'mailto:akshayarora.work@gmail.com', icon: 'envelope' }
  ];
}
