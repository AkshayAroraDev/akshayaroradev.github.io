import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import footerData from '../../../json/footer.json';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss'
})
export class AppFooterComponent {
  currentYear = new Date().getFullYear();

  socialLinks = footerData.socialLinks;
  navigationLinks = footerData.navigationLinks;
  connectLinks = footerData.socialLinks;
}
