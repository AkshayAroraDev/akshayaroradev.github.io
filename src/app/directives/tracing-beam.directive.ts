import { Directive, OnInit, OnDestroy, HostListener } from '@angular/core';

@Directive({
  selector: '[appTracingBeam]',
  standalone: true
})
export class TracingBeamDirective implements OnInit, OnDestroy {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private scrollProgress = 0;
  private heroHeight = 0;
  private scrollbarContainer: HTMLElement | null = null;

  constructor() {}

  ngOnInit() {
    this.createScrollbar();
    this.getHeroHeight();
  }

  private getHeroHeight() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      this.heroHeight = heroSection.clientHeight;
    }
  }

  private createScrollbar() {
    this.scrollbarContainer = document.createElement('div');
    this.scrollbarContainer.className = 'tracing-beam-container';
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = 4;
    this.canvas.height = window.innerHeight;
    this.canvas.className = 'tracing-beam-canvas';
    
    this.ctx = this.canvas.getContext('2d');
    this.scrollbarContainer.appendChild(this.canvas);
    document.body.appendChild(this.scrollbarContainer);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.updateScrollProgress();
    this.toggleScrollbarVisibility();
    this.drawBeam();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.canvas) {
      this.canvas.height = window.innerHeight;
    }
    this.getHeroHeight();
  }

  private toggleScrollbarVisibility() {
    const scrollTop = window.scrollY;
    if (this.scrollbarContainer) {
      if (scrollTop > this.heroHeight) {
        this.scrollbarContainer.style.opacity = '1';
        this.scrollbarContainer.style.pointerEvents = 'none';
      } else {
        this.scrollbarContainer.style.opacity = '0';
      }
    }
  }

  private updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
  }

  private drawBeam() {
    if (!this.ctx || !this.canvas) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate scroll progress relative to content after hero
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollAfterHero = Math.max(0, scrollTop - this.heroHeight);
    const maxScrollAfterHero = docHeight - this.heroHeight;
    const progressAfterHero = maxScrollAfterHero > 0 ? scrollAfterHero / maxScrollAfterHero : 0;

    // Only draw beam after hero section
    if (scrollTop > this.heroHeight) {
      // Draw beam with increased height - 40% of viewport
      const beamHeight = window.innerHeight * 0.4;
      const beamTop = progressAfterHero * (this.canvas.height - beamHeight);

      // Main gradient for beam - smooth vertical transition
      const gradient = this.ctx.createLinearGradient(0, beamTop, 0, beamTop + beamHeight);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0)');      // Transparent purple top
      gradient.addColorStop(0.15, 'rgba(139, 92, 246, 0.6)'); // Purple
      gradient.addColorStop(0.4, 'rgba(217, 70, 239, 0.8)');  // Magenta
      gradient.addColorStop(0.65, 'rgba(100, 150, 246, 0.7)'); // Blue
      gradient.addColorStop(0.85, 'rgba(100, 150, 246, 0.4)'); // Light blue
      gradient.addColorStop(1, 'rgba(100, 150, 246, 0)');     // Transparent blue bottom

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, beamTop, this.canvas.width, beamHeight);

      // Draw subtle glow effect
      this.ctx.shadowColor = 'rgba(100, 150, 246, 0.3)';
      this.ctx.shadowBlur = 8;
      this.ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
      this.ctx.fillRect(0, beamTop + beamHeight / 2 - 1.5, this.canvas.width, 3);
    }
  }

  ngOnDestroy() {
    if (this.scrollbarContainer) {
      this.scrollbarContainer.remove();
    }
  }
}
