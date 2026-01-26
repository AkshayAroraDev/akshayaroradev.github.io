import { Component, ViewChild, AfterViewInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { AppButtonComponent } from '../app-button/app-button.component';
import { NgxDotpatternComponent } from '@omnedia/ngx-dotpattern';
import { NgxSplitTextComponent } from '@omnedia/ngx-split-text';
import { CharMagnifyDirective } from '../../directives/proximity-magnify.directive';
import { ThemeService } from '../../services/theme.service';
import { hexToRgbString, getThemeColorsFromCSS } from '../../utils/color.utils';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [AppButtonComponent, NgxDotpatternComponent, NgxSplitTextComponent, CharMagnifyDirective],
  templateUrl: './app-hero.component.html',
  styleUrl: './app-hero.component.scss'
})
export class AppHeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('splitText') splitTextComponent!: NgxSplitTextComponent;
  
  subtitle = 'Frontend Engineer';
  descriptionParagraph1 = 'I\'m a Senior Frontend Engineer with 8+ years of experience building scalable, high-performance web applications. I specialize in Angular and TypeScript, and I enjoy translating complex business requirements into clean, intuitive user experiences.';
  descriptionParagraph2 = 'I believe great frontend work is invisible — it removes friction, scales gracefully, and just works.';

  private animationInterval: ReturnType<typeof setInterval> | undefined;
  private themeObserver: MutationObserver | undefined;

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private themeService: ThemeService
  ) {}

  ngAfterViewInit() {
    // Start animation loop every 4 seconds
    this.animationInterval = setInterval(() => {
      if (this.splitTextComponent) {
        this.splitTextComponent.animateIn();
      }
    }, 4000);

    // Initial gradient update and watch for theme changes
    this.updateGradients();
    this.watchThemeChanges();
  }

  private updateGradients(): void {
    // Get theme colors from CSS variables (set by ThemeService)
    const { primary, secondary } = getThemeColorsFromCSS();
    const textPrimary = 'rgb(209, 213, 219)';

    // Update text character gradients with proper background-size
    const chars = this.elementRef.nativeElement.querySelectorAll('.hero__title .char');
    chars.forEach((char: HTMLElement) => {
      const gradient = `linear-gradient(135deg, ${textPrimary}, rgba(${hexToRgbString(primary)}, 0.8), rgba(${hexToRgbString(secondary)}, 0.8), ${textPrimary})`;
      char.style.backgroundImage = gradient;
      char.style.backgroundSize = '300% 300%';
      char.style.backgroundPosition = '0% 50%';
      char.style.webkitBackgroundClip = 'text';
      char.style.webkitTextFillColor = 'transparent';
      char.style.backgroundClip = 'text';
    });

    // Update subtitle gradient
    const subtitle = this.elementRef.nativeElement.querySelector('.split-text-subtitle');
    if (subtitle) {
      const gradient = `linear-gradient(90deg, ${primary}, ${secondary})`;
      subtitle.style.backgroundImage = gradient;
      subtitle.style.webkitBackgroundClip = 'text';
      subtitle.style.webkitTextFillColor = 'transparent';
      subtitle.style.backgroundClip = 'text';
    }

    // Update hero background gradient
    const heroElement = this.elementRef.nativeElement.querySelector('.hero');
    if (heroElement) {
      const primaryRgb = hexToRgbString(primary);
      const secondaryRgb = hexToRgbString(secondary);
      const gradient = `linear-gradient(-45deg, #0a0a0f 0%, rgba(${primaryRgb}, 0.03) 25%, #0f0f1a 50%, rgba(${secondaryRgb}, 0.02) 75%, #0d0d1a 100%)`;
      heroElement.style.backgroundImage = gradient;
      heroElement.style.backgroundSize = '400% 400%';
    }
  }

  private watchThemeChanges(): void {
    this.ngZone.runOutsideAngular(() => {
      this.themeObserver = new MutationObserver(() => {
        // Update gradients when theme CSS variables change
        this.ngZone.run(() => {
          this.updateGradients();
        });
      });

      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style']
      });
    });
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  }

  downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/docs/Resume_AkshayArora_2025.pdf';
    link.download = 'Resume_AkshayArora_2025.pdf';
    link.click();
  }

  scrollToFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
