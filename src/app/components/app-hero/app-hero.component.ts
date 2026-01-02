import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AppButtonComponent } from '../app-button/app-button.component';
import { NgxDotpatternComponent } from '@omnedia/ngx-dotpattern';
import { NgxSplitTextComponent } from '@omnedia/ngx-split-text';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [AppButtonComponent, NgxDotpatternComponent, NgxSplitTextComponent],
  templateUrl: './app-hero.component.html',
  styleUrl: './app-hero.component.scss'
})
export class AppHeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('splitText') splitTextComponent!: NgxSplitTextComponent;
  
  name = 'Hi, I\'m Akshay Arora';
  subtitle = 'Frontend Engineer';
  description = 'I code with purpose and design with empathy. As a Frontend Engineer, I transform complex requirements into intuitive, performant web experiences.\n\nPhilosophy: Great frontends are invisible. They remove friction, not add it.\n\nFun fact: This portfolio was built with Angular, SCSS, and countless cups of chai.';
  
  private animationInterval: ReturnType<typeof setInterval> | undefined;

  ngAfterViewInit() {
    // Start animation loop every 4 seconds
    this.animationInterval = setInterval(() => {
      if (this.splitTextComponent) {
        this.splitTextComponent.animateIn();
      }
    }, 4000);
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/docs/Resume_AkshayArora_2025.pdf';
    link.download = 'Resume_AkshayArora_2025.pdf';
    link.click();
  }
}
