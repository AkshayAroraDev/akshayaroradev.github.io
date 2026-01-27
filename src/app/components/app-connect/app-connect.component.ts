import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import footerData from '../../../json/footer.json';

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-connect.component.html',
  styleUrl: './app-connect.component.scss'
})
export class AppConnectComponent {
  connectLinks = footerData.socialLinks;
}
