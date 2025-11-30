import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  details: string[];
}

@Component({
  selector: 'app-custom-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-timeline.component.html',
  styleUrls: ['./custom-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('timelineContainer', { static: false })
  timelineContainer!: ElementRef<HTMLDivElement>;

  timelineItems: TimelineItem[] = [
    {
      year: '2022',
      title: 'Design Phase',
      description: 'The team works on the design specifications and first mockups.',
      details: [
        'Creation of user interface designs',
        'User experience workshops and feedback sessions',
        'Finalizing design prototypes',
      ],
    },
    {
      year: '2023',
      title: 'Development Phase',
      description: 'Developers start coding, focusing on core functionalities first.',
      details: [
        'Setting up the development environment',
        'Developing the primary application features',
        'Integration of backend and frontend components',
      ],
    },
    {
      year: '2024',
      title: 'Launch & Optimization',
      description: 'The project is ready for production deployment.',
      details: [
        'Production deployment',
        'User feedback collection',
        'Performance optimization',
      ],
    },
    {
      year: '2025',
      title: 'Growth & Expansion',
      description: 'Ongoing improvements and feature expansion.',
      details: [
        'New features implementation',
        'Enhanced user experience',
        'Continuous monitoring and support',
      ],
    },
    {
      year: '2025 Q2',
      title: 'Infrastructure Update',
      description: 'Migrating to cloud-based infrastructure for better scalability.',
      details: [
        'Cloud migration planning',
        'Database optimization',
        'Security enhancements',
      ],
    },
    {
      year: '2025 Q3',
      title: 'AI Integration',
      description: 'Implementing AI-powered features to enhance user experience.',
      details: [
        'Machine learning model development',
        'AI chatbot implementation',
        'Predictive analytics integration',
      ],
    },
    {
      year: '2025 Q4',
      title: 'Mobile App Launch',
      description: 'Releasing native mobile applications for iOS and Android.',
      details: [
        'Cross-platform development',
        'Mobile UI/UX optimization',
        'App store deployment',
      ],
    },
    {
      year: '2026 Q1',
      title: 'Global Expansion',
      description: 'Expanding services to new markets and regions worldwide.',
      details: [
        'Localization efforts',
        'Regional server deployment',
        'Multi-language support',
      ],
    },
    {
      year: '2026 Q2',
      title: 'Enterprise Features',
      description: 'Introducing advanced features for enterprise clients.',
      details: [
        'Advanced reporting tools',
        'Custom integrations API',
        'Dedicated support team',
      ],
    },
    {
      year: '2026 Q3',
      title: 'Community Building',
      description: 'Creating a thriving community around the platform.',
      details: [
        'Developer documentation',
        'Community forum launch',
        'Hackathon events',
      ],
    },
  ];

  scrollProgress = 0;
  svgWidth = 100; // Width of SVG in coordinate units
  svgHeight = 1000; // Height will be calculated dynamically
  backgroundPathData = '';
  private destroy$ = new Subject<void>();

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Initial calculation
    this.updateScrollProgress();

    // Listen to scroll events with throttling for performance
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'scroll')
        .pipe(
          throttleTime(16), // ~60fps
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.updateScrollProgress();
          this.ngZone.run(() => {
            this.cdr.markForCheck();
          });
        });
    });

    // Handle window resize
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(
          throttleTime(100),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.updateScrollProgress();
          this.generateCurvedPath();
          this.ngZone.run(() => {
            this.cdr.markForCheck();
          });
        });
    });
  }

  ngAfterViewInit(): void {
    // Generate path after view is fully rendered
    setTimeout(() => {
      this.generateCurvedPath();
      this.cdr.markForCheck();
    }, 100);
  }

  /**
   * Generate a smooth curved path connecting all timeline items
   */
  private generateCurvedPath(): void {
    if (!this.timelineContainer) return;

    const container = this.timelineContainer.nativeElement;
    const items = container.querySelectorAll('.timeline-item');

    if (items.length === 0) return;

    // Get container dimensions in pixels
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Update SVG dimensions
    this.svgWidth = containerWidth;
    this.svgHeight = containerHeight;

    // Get positions of centered dots for each item
    const points: Array<{ x: number; y: number }> = [];
    const containerRect = container.getBoundingClientRect();

    items.forEach((item) => {
      // Get centered dot position
      const dot = (item as HTMLElement).querySelector('.item-dot') as HTMLElement;
      if (dot) {
        const rect = dot.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;
        points.push({ x, y });
      }
    });

    // Generate smooth zigzag curved path through points
    this.backgroundPathData = this.generateZigzagPath(points);

    this.cdr.markForCheck();
  }

  /**
   * Generate a zigzag path with S-curves between timeline item bottom dots
   */
  private generateZigzagPath(points: Array<{ x: number; y: number }>): string {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    // Connect each pair of consecutive bottom dots with an S-curve
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      // Calculate midpoint
      const midY = (p1.y + p2.y) / 2;

      // Determine curve direction based on whether we're moving left or right
      const isMovingRight = p2.x > p1.x;

      // Control point 1: slightly offset from p1
      const cp1x = p1.x + (isMovingRight ? 60 : -60);
      const cp1y = midY - Math.abs(p2.y - p1.y) / 4;

      // Control point 2: slightly offset from p2
      const cp2x = p2.x + (isMovingRight ? -60 : 60);
      const cp2y = midY + Math.abs(p2.y - p1.y) / 4;

      // Create smooth cubic bezier curve
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  }

  /**
   * Calculates the scroll progress based on the timeline container's position
   * in the viewport. The fill animates smoothly as the user scrolls.
   */
  private updateScrollProgress(): void {
    if (!this.timelineContainer) return;

    const container = this.timelineContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Distance from top of viewport to top of timeline container
    const distanceFromTop = rect.top;

    // Trigger start: when timeline reaches 80% of viewport from top
    const triggerStart = viewportHeight * 0.2;
    // Trigger end: when timeline completely passes through viewport
    const triggerEnd = rect.height + viewportHeight * 0.2;

    // Calculate progress: 0 (not visible/above) to 1 (completely scrolled past)
    let progress = (viewportHeight - distanceFromTop - triggerStart) / triggerEnd;

    // Clamp progress to [0, 1]
    progress = Math.max(0, Math.min(1, progress));

    this.scrollProgress = progress;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

