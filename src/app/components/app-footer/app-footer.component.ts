import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconAttribution } from '../../models';

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
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/akshay-arora-3b25855b/', iconPath: 'assets/icons/skills/linkedin.svg' },
    { label: 'GitHub', url: 'https://github.com/AkshayAroraDev', iconPath: 'assets/icons/skills/github.svg' },
    { label: 'Email', url: 'mailto:akshayarora.work@gmail.com', iconPath: 'assets/icons/skills/email.svg' }
  ];

  navigationLinks = [
    { label: 'Home', url: '#hero' },
    { label: 'Skills', url: '#skills' },
    { label: 'Experience', url: '#timeline' }
  ];
}
