import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomTimelineComponent } from './custom-timeline/custom-timeline.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CustomTimelineComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-angular-app');
}
