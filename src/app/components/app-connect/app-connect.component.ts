import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-connect.component.html',
  styleUrl: './app-connect.component.scss'
})
export class AppConnectComponent {
  connectLinks = [
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/akshay-arora-3b25855b/',
      iconPath: 'assets/icons/skills/linkedin.svg'
    },
    {
      label: 'GitHub',
      url: 'https://github.com/AkshayAroraDev',
      iconPath: 'assets/icons/skills/github.svg'
    },
    {
      label: 'Email',
      url: 'mailto:akshayarora.work@gmail.com',
      iconPath: 'assets/icons/skills/email.svg'
    }
  ];
}
