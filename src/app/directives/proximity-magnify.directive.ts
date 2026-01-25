import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy
} from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[charMagnify]',
  standalone: true
})
export class CharMagnifyDirective implements AfterViewInit, OnDestroy {
  @Input() maxScale = 2;
  @Input() radius = 30;
  @Input() enableColor = true;
  @Input() enableWeight = true;

  private chars: HTMLElement[] = [];
  private rafId?: number;
  private isTouchDevice = false;

  constructor(private el: ElementRef, private zone: NgZone) {
    // Detect touch devices
    this.isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  }

  ngAfterViewInit() {
    // Skip on touch devices
    if (this.isTouchDevice) return;

    this.splitText();

    this.zone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.onMouseMove);
    });
  }

  private splitText() {
    const text = this.el.nativeElement.textContent;
    this.el.nativeElement.textContent = '';

    [...text].forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.classList.add('char');
      this.el.nativeElement.appendChild(span);
      this.chars.push(span);
    });
  }

  private onMouseMove = (event: MouseEvent) => {
    if (this.rafId) return;

    this.rafId = requestAnimationFrame(() => {
      this.updateChars(event);
      this.rafId = undefined;
    });
  };

  private updateChars(event: MouseEvent) {
    const { clientX, clientY } = event;

    this.chars.forEach((char) => {
      const rect = char.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const distance = Math.hypot(clientX - cx, clientY - cy);
      
      // Gaussian falloff for more natural effect
      const strength = Math.exp(-distance * distance / (2 * this.radius * this.radius));
      const scale = 1 + strength * (this.maxScale - 1);

      const animationConfig: any = {
        scale,
        duration: 0.2,
        ease: 'power3.out',
        overwrite: 'auto'
      };

      // Optional: Add color effect
      if (this.enableColor) {
        animationConfig.color = `rgba(200, 100, 255, ${0.6 + strength * 0.4})`;
      }

      // Optional: Add font weight effect
      if (this.enableWeight) {
        animationConfig.fontWeight = 400 + strength * 400;
      }

      gsap.to(char, animationConfig);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
