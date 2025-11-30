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
  Input,
} from '@angular/core';

interface TimelineEntry {
  year: string;
  title: string;
  items: string[];
}

@Component({
  selector: 'app-scroll-progress-timeline',
  templateUrl: './scroll-progress-timeline.component.html',
  styleUrls: ['./scroll-progress-timeline.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ScrollProgressTimelineComponent implements AfterViewInit {
  @ViewChild('timelineWrapper', { static: false })
  timelineWrapper!: ElementRef<HTMLDivElement>;

  @Input() entries: TimelineEntry[] = [];

  // Controls the fill level of the timeline (0 = empty, 1 = fully filled)
  scrollProgress = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.initializeDefaultEntries();
  }

  ngAfterViewInit(): void {
    // Calculate fill once initially in case timeline is already in view
    this.calculateScrollProgress();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Run scroll handler outside Angular zone for performance
    this.ngZone.runOutsideAngular(() => {
      this.calculateScrollProgress();
      this.ngZone.run(() => {
        this.cdr.detectChanges();
      });
    });
  }

  /**
   * Calculates the scroll progress based on the timeline element's position
   * relative to the viewport. The fill starts when the timeline enters and
   * completes when it exits the viewport.
   */
  private calculateScrollProgress(): void {
    if (!this.timelineWrapper) return;

    const timelineElement = this.timelineWrapper.nativeElement;
    const elementRect = timelineElement.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Distance from top of viewport to the top of the timeline
    const distanceFromTop = elementRect.top;

    // Start fill when timeline is 20% into the viewport
    const triggerStart = viewportHeight * 0.2;
    // Complete fill when timeline has fully passed the viewport
    const triggerEnd = elementRect.height + viewportHeight * 0.2;

    // Calculate progress in range [0, 1]
    let progress = (viewportHeight - distanceFromTop - triggerStart) / triggerEnd;
    progress = Math.max(0, Math.min(1, progress));

    this.scrollProgress = progress;
  }

  /**
   * Initialize with default timeline entries if none provided
   */
  private initializeDefaultEntries(): void {
    if (this.entries.length === 0) {
      this.entries = [
        {
          year: '2022',
          title: 'Design Phase',
          items: [
            'Creation of user interface designs',
            'User experience workshops and feedback sessions',
            'Finalizing design prototypes',
          ],
        },
        {
          year: '2023',
          title: 'Development Phase',
          items: [
            'Setting up the development environment',
            'Developing the primary application features',
            'Integration of backend and frontend components',
          ],
        },
        {
          year: '2024',
          title: 'Launch & Optimization',
          items: [
            'Production deployment',
            'User feedback collection',
            'Performance optimization',
          ],
        },
        {
          year: '2025',
          title: 'Growth & Expansion',
          items: [
            'New features implementation',
            'Enhanced user experience',
            'Continuous monitoring and support',
          ],
        },
      ];
    }
  }
}
