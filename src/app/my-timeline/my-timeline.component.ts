import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgZone,
} from '@angular/core';

@Component({
  selector: 'app-my-timeline',
  templateUrl: './my-timeline.component.html',
  styleUrls: ['./my-timeline.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class MyTimelineComponent implements AfterViewInit {
  @ViewChild('timelineWrapper', { static: false })
  timelineWrapper!: ElementRef<HTMLDivElement>;

  // 0 = empty, 1 = fully filled
  timelineFill = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    // run once initially in case timeline is already in view
    this.updateTimelineFill();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.ngZone.runOutsideAngular(() => {
      this.updateTimelineFill();
      this.ngZone.run(() => {
        this.cdr.detectChanges();
      });
    });
  }

  private updateTimelineFill(): void {
    if (!this.timelineWrapper) return;

    const el = this.timelineWrapper.nativeElement;
    const rect = el.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // How far from top of viewport to the top of the timeline
    const distanceFromTop = rect.top;

    // When top of timeline hits ~80% of viewport, start fill
    const start = viewportHeight * 0.2;
    // When bottom of timeline passes top of viewport, consider full
    const end = rect.height + viewportHeight * 0.2;

    // progress in [0,1]
    let progress = (viewportHeight - distanceFromTop - start) / end;
    progress = Math.max(0, Math.min(1, progress));

    this.timelineFill = progress;
  }
}
