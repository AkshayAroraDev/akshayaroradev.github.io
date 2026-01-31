import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../services/theme.service';
import { Theme } from '../../constants/themes';
import toolbarData from '../../../json/toolbar.json';

interface ToolbarLink {
  icon: string;
  label: string;
  sectionId: string;
  type: 'navigation' | 'external';
}

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './app-toolbar.component.html',
  styleUrl: './app-toolbar.component.scss'
})
export class AppToolbarComponent implements OnInit {
  toolbarLinks: ToolbarLink[] = toolbarData.toolbarLinks as ToolbarLink[];

  themes: Theme[];
  currentTheme: Theme;
  showThemeMenu = false;
  showColorPicker = false;
  customPrimaryColor = '#2563eb';
  customSecondaryColor = '#0ea5e9';

  constructor(private themeService: ThemeService) {
    this.themes = this.themeService.themes;
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  ngOnInit() {
    // Subscribe to theme changes
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  switchTheme(theme: Theme) {
    this.themeService.switchTheme(theme);
    this.showThemeMenu = false;
  }

  toggleThemeMenu() {
    this.showThemeMenu = !this.showThemeMenu;
    if (this.showThemeMenu) {
      this.showColorPicker = false;
    }
  }

  toggleColorPicker() {
    this.showColorPicker = !this.showColorPicker;
  }

  applyCustomColor() {
    const customTheme: Theme = {
      id: 'custom',
      name: 'Custom',
      primary: this.customPrimaryColor,
      secondary: this.customSecondaryColor
    };
    this.themeService.switchTheme(customTheme);
  }

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
    link.href = 'assets/docs/Akshay_Arora.pdf';
    link.download = 'Akshay_Arora.pdf';
    link.click();
  }
}
