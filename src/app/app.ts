import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomTimelineComponent } from './custom-timeline/custom-timeline.component';
import { AppHeroComponent } from './components/app-hero/app-hero.component';
import { AppSkillsComponent } from './components/app-skills/app-skills.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CustomTimelineComponent, AppHeroComponent, AppSkillsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio-app');
}
