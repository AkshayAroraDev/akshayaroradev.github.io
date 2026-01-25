import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-scroll-to-top.component.html',
  styleUrl: './app-scroll-to-top.component.scss'
})
export class AppScrollToTopComponent implements OnInit, OnDestroy {
  isVisible = false;
  private scrollThreshold = 600; // pixels from top to show the button
  private isMobile = false;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.isMobile = window.innerWidth < 768;
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll);
      window.addEventListener('resize', this.onResize);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }

  onScroll = () => {
    if (this.isMobile) {
      this.isVisible = false;
      return;
    }

    const newVisibility = window.scrollY > this.scrollThreshold;
    if (this.isVisible !== newVisibility) {
      this.ngZone.run(() => {
        this.isVisible = newVisibility;
        this.cdr.markForCheck();
      });
    }
  };

  onResize = () => {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isVisible = false;
    } else {
      this.onScroll();
    }
  };

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
