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
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import {
  SCROLL_THROTTLE_MS,
  RESIZE_THROTTLE_MS,
  PATH_GENERATION_DELAY_MS,
  Y_OFFSET,
  BEZIER_CONTROL_OFFSET,
  BEZIER_CURVE_DIVISOR,
  PROGRESS_PRECISION,
  PROGRESS_HIGHLIGHT_THRESHOLD,
  SVG_INITIAL_WIDTH,
  SVG_INITIAL_HEIGHT,
} from '@src/constants/timeline.constants';
import timelineData from '@src/config/timeline.json';

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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './custom-timeline.component.html',
  styleUrls: ['./custom-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('timelineContainer', { static: false })
  timelineContainer!: ElementRef<HTMLDivElement>;

  timelineItems: TimelineItem[] = timelineData.timelineItems;

  scrollProgress = 0;
  svgWidth = SVG_INITIAL_WIDTH;
  svgHeight = SVG_INITIAL_HEIGHT;
  backgroundPathData = '';
  private destroy$ = new Subject<void>();
  private lastScrollProgress = -1;

  // Track which items should be highlighted based on scroll position
  highlightedItemIndex = -1;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateScrollProgress();
    this.setupEventListeners();
  }

  /**
   * Setup scroll and resize event listeners with appropriate throttling
   */
  private setupEventListeners(): void {
    this.setupScrollListener();
    this.setupResizeListener();
  }

  /**
   * Setup scroll event listener with throttling for performance
   */
  private setupScrollListener(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'scroll')
        .pipe(
          throttleTime(SCROLL_THROTTLE_MS),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.updateScrollProgress();
        });
    });
  }

  /**
   * Setup resize event listener with throttling
   */
  private setupResizeListener(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(
          throttleTime(RESIZE_THROTTLE_MS),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.generateCurvedPath();
          this.updateScrollProgress();
        });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.generateCurvedPath();
      this.cdr.markForCheck();
    }, PATH_GENERATION_DELAY_MS);
  }

  /**
   * Generate a smooth curved path connecting all timeline items
   */
  private generateCurvedPath(): void {
    if (!this.timelineContainer) return;

    const container = this.timelineContainer.nativeElement;
    const items = container.querySelectorAll('.timeline-item');

    if (items.length === 0) return;

    // Update SVG dimensions
    this.svgWidth = container.offsetWidth;
    this.svgHeight = container.offsetHeight;

    // Get dot positions relative to container
    const points = this.extractDotPositions(items, container);
    
    if (points.length < 2) return;

    // Generate smooth zigzag curved path through points
    this.backgroundPathData = this.generateZigzagPath(points);
    this.cdr.markForCheck();
  }

  /**
   * Extract dot positions from timeline items relative to container
   */
  private extractDotPositions(
    items: NodeListOf<Element>,
    container: HTMLElement
  ): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];
    const containerRect = container.getBoundingClientRect();

    for (let i = 0; i < items.length; i++) {
      const dot = items[i].querySelector('.item-dot') as HTMLElement;
      if (dot) {
        const rect = dot.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;
        points.push({ x, y });
      }
    }

    return points;
  }

  /**
   * Generate a zigzag path with S-curves between timeline item dots
   */
  private generateZigzagPath(points: Array<{ x: number; y: number }>): string {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y + Y_OFFSET}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const { cp1x, cp1y, cp2x, cp2y } = this.calculateBezierControlPoints(p1, p2);

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y + Y_OFFSET}`;
    }

    return path;
  }

  /**
   * Calculate bezier control points for smooth curve between two points
   */
  private calculateBezierControlPoints(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ): { cp1x: number; cp1y: number; cp2x: number; cp2y: number } {
    const midY = (p1.y + p2.y) / 2;
    const isMovingRight = p2.x > p1.x;
    const verticalDistance = Math.abs(p2.y - p1.y) / BEZIER_CURVE_DIVISOR;

    return {
      cp1x: p1.x + (isMovingRight ? BEZIER_CONTROL_OFFSET : -BEZIER_CONTROL_OFFSET),
      cp1y: midY - verticalDistance + Y_OFFSET,
      cp2x: p2.x + (isMovingRight ? -BEZIER_CONTROL_OFFSET : BEZIER_CONTROL_OFFSET),
      cp2y: midY + verticalDistance + Y_OFFSET,
    };
  }

  /**
   * Calculates the scroll progress based on the timeline container's position
   * in the viewport. The fill animates smoothly as the user scrolls.
   */
  private updateScrollProgress(): void {
    if (!this.timelineContainer) return;

    const container = this.timelineContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const distanceFromTop = rect.top;
    const triggerEnd = -rect.height;

    // Calculate progress: 0 (top not visible) to 1 (bottom completely scrolled past)
    let progress = (viewportHeight - distanceFromTop) / (viewportHeight - triggerEnd);
    progress = Math.max(0, Math.min(1, progress));

    // Only trigger change detection if progress changed meaningfully
    const roundedProgress = Math.round(progress * 1000) / 1000;
    if (Math.abs(roundedProgress - this.lastScrollProgress) > PROGRESS_PRECISION) {
      this.scrollProgress = progress;
      this.lastScrollProgress = roundedProgress;
      this.updateHighlightedItem(progress);
      
      this.ngZone.run(() => {
        this.cdr.markForCheck();
      });
    }
  }

  /**
   * Determine which timeline item should be highlighted based on scroll progress
   * Only highlight when the connector line reaches the dot position
   */
  private updateHighlightedItem(progress: number): void {
    if (!this.timelineContainer) return;

    const container = this.timelineContainer.nativeElement;
    const items = container.querySelectorAll('.timeline-item');

    if (items.length === 0) {
      this.highlightedItemIndex = -1;
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const fillHeight = container.offsetHeight * progress;
    let maxHighlightedIndex = this.findHighestDotBelow(items, containerRect, fillHeight);

    // If we're at threshold, ensure the last item is highlighted
    if (progress >= PROGRESS_HIGHLIGHT_THRESHOLD) {
      maxHighlightedIndex = items.length - 1;
    }

    this.highlightedItemIndex = maxHighlightedIndex;
  }

  /**
   * Find the highest index of dot position below the fill height
   */
  private findHighestDotBelow(
    items: NodeListOf<Element>,
    containerRect: DOMRect,
    fillHeight: number
  ): number {
    let maxHighlightedIndex = -1;

    for (let i = 0; i < items.length; i++) {
      const dot = items[i].querySelector('.item-dot') as HTMLElement;
      if (dot) {
        const dotRect = dot.getBoundingClientRect();
        const dotY = dotRect.top - containerRect.top + dotRect.height / 2;

        if (fillHeight >= dotY) {
          maxHighlightedIndex = i;
        }
      }
    }

    return maxHighlightedIndex;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

