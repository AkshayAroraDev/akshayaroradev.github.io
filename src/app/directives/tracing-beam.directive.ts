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
      // Draw beam with increased height - 30% of viewport
      const beamHeight = window.innerHeight * 0.3;
      const beamTop = progressAfterHero * (this.canvas.height - beamHeight);

      // Create main gradient for beam - smooth vertical transition
      const gradient = this.ctx.createLinearGradient(0, beamTop, 0, beamTop + beamHeight);
      
      // Top (thinner, more transparent)
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0)');       // Transparent purple top
      gradient.addColorStop(0.1, 'rgba(139, 92, 246, 0.15)');  // Thin purple
      gradient.addColorStop(0.25, 'rgba(139, 92, 246, 0.4)');  // Building purple
      
      // Middle (transitioning through magenta)
      gradient.addColorStop(0.4, 'rgba(217, 70, 239, 0.7)');   // Magenta middle
      gradient.addColorStop(0.55, 'rgba(217, 70, 239, 0.8)');  // Strong magenta
      
      // Lower middle (transitioning to blue)
      gradient.addColorStop(0.7, 'rgba(100, 150, 246, 0.8)');  // Blue starts
      gradient.addColorStop(0.85, 'rgba(100, 150, 246, 0.7)'); // Strong blue
      
      // Bottom (thicker, more opaque)
      gradient.addColorStop(0.95, 'rgba(100, 150, 246, 0.3)'); // Thickening blue
      gradient.addColorStop(1, 'rgba(100, 150, 246, 0.05)');   // Fades out bottom

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, beamTop, this.canvas.width, beamHeight);

      // Add width variation by drawing with varying widths from top to bottom
      // This creates the "thicker at bottom" effect
      for (let i = 0; i < beamHeight; i += 2) {
        const y = beamTop + i;
        const progress = i / beamHeight; // 0 at top, 1 at bottom
        
        // Width increases towards bottom
        const widthMultiplier = 0.5 + progress * 1.5; // 0.5x to 2x width
        
        // Opacity increases towards bottom
        const opacityFactor = Math.pow(progress, 0.8);
        
        // Create gradient for this line
        const lineGradient = this.ctx.createLinearGradient(0, y, 0, y + 2);
        lineGradient.addColorStop(0, `rgba(100, 150, 246, ${0.1 * opacityFactor})`);
        lineGradient.addColorStop(0.5, `rgba(217, 70, 239, ${0.3 * opacityFactor})`);
        lineGradient.addColorStop(1, `rgba(139, 92, 246, ${0.1 * opacityFactor})`);
        
        this.ctx.fillStyle = lineGradient;
        this.ctx.fillRect(0, y, this.canvas.width * widthMultiplier, 2);
      }

      // Draw subtle core glow (brighter at bottom)
      const coreGradient = this.ctx.createLinearGradient(0, beamTop, 0, beamTop + beamHeight);
      coreGradient.addColorStop(0, 'rgba(100, 150, 246, 0)');
      coreGradient.addColorStop(0.5, 'rgba(217, 70, 239, 0.2)');
      coreGradient.addColorStop(1, 'rgba(100, 150, 246, 0.3)');
      
      this.ctx.fillStyle = coreGradient;
      this.ctx.fillRect(0, beamTop, this.canvas.width, beamHeight);
    }
  }

  ngOnDestroy() {
    if (this.scrollbarContainer) {
      this.scrollbarContainer.remove();
    }
  }
}
