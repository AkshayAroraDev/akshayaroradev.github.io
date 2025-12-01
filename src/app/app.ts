import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomTimelineComponent } from './custom-timeline/custom-timeline.component';
import { AppHeroComponent } from './components/app-hero/app-hero.component';
import { TracingBeamDirective } from './directives/tracing-beam.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CustomTimelineComponent, AppHeroComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  hostDirectives: [TracingBeamDirective]
})
export class App {
  protected readonly title = signal('portfolio-app');
}
