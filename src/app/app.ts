import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { signal } from '@angular/core';
import { NgxTracingBeamComponent } from '@omnedia/ngx-tracing-beam';
import { CustomTimelineComponent } from './custom-timeline/custom-timeline.component';
import { AppHeroComponent } from './components/app-hero/app-hero.component';
import { AppSkillsComponent } from './components/app-skills/app-skills.component';
import { AppProjectsComponent } from './components/app-projects/app-projects.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AppToolbarComponent } from './components/app-toolbar/app-toolbar.component';
import { AppScrollToTopComponent } from './components/app-scroll-to-top/app-scroll-to-top.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxTracingBeamComponent, CustomTimelineComponent, AppHeroComponent, AppSkillsComponent, AppProjectsComponent, AppFooterComponent, AppToolbarComponent, AppScrollToTopComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio-app');

  constructor(private themeService: ThemeService) {
    // Theme is automatically loaded and applied by ThemeService constructor
    // No additional setup needed!
  }
}
