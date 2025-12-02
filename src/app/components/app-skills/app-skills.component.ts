import { Component, signal, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ViewChildren, ElementRef, AfterViewInit, QueryList, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxConnectionBeamComponent } from '@omnedia/ngx-connection-beam';
import { NgxTypewriterComponent } from '@omnedia/ngx-typewriter';

interface SkillItem {
  name: string;
}

interface SkillGroup {
  title: string;
  skills: SkillItem[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, NgxConnectionBeamComponent, NgxTypewriterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app-skills.component.html',
  styleUrl: './app-skills.component.scss'
})
export class AppSkillsComponent implements AfterViewInit {
  selectedVariation = signal(2); // Use variation 2 only
  @ViewChild('centerRef') centerRef!: ElementRef;
  @ViewChildren('skillElement') skillElements!: QueryList<ElementRef>;
  
  // Store references to HTML elements for beam connections
  skillRefs: { [key: string]: HTMLElement | null } = {};
  centerElement: HTMLElement | null = null;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngAfterViewInit() {
    // Run outside Angular zone to prevent change detection issues
    this.ngZone.runOutsideAngular(() => {
      this.updateSkillReferences();
      // Re-enter Angular zone after references are updated
      this.ngZone.run(() => {
        this.cdr.detectChanges();
      });
    });
  }

  updateSkillReferences() {
    // Clear previous references
    this.skillRefs = {};
    this.centerElement = null;
    
    // Get center element - target the badge div specifically
    if (this.centerRef) {
      this.centerElement = this.centerRef.nativeElement;
    }
    
    // Get all skill elements
    if (this.skillElements && this.skillElements.length > 0) {
      // For variation 2, we only use activeGroups[0] and activeGroups[1]
      const leftSkills = this.activeGroups[0]?.skills || [];
      const rightSkills = this.activeGroups[1]?.skills || [];
      
      let elementIndex = 0;
      
      // Map left group - get the badge element inside
      for (let i = 0; i < leftSkills.length; i++) {
        const element = this.skillElements.get(elementIndex);
        if (element && leftSkills[i]) {
          // Get the badge div which is the first child
          const badgeElement = element.nativeElement.querySelector('.skills__skill-badge');
          this.skillRefs[leftSkills[i].name] = badgeElement || element.nativeElement;
        }
        elementIndex++;
      }
      
      // Map right group - get the badge element inside
      for (let i = 0; i < rightSkills.length; i++) {
        const element = this.skillElements.get(elementIndex);
        if (element && rightSkills[i]) {
          // Get the badge div which is the first child
          const badgeElement = element.nativeElement.querySelector('.skills__skill-badge');
          this.skillRefs[rightSkills[i].name] = badgeElement || element.nativeElement;
        }
        elementIndex++;
      }
    }
  }
  variation1Groups: SkillGroup[] = [
    {
      title: 'Frontend',
      skills: [
        { name: 'Angular' },
        { name: 'TypeScript' },
        { name: 'RxJs' },
        { name: 'Material Design' }
      ]
    },
    {
      title: 'Styling & Tools',
      skills: [
        { name: 'HTML5' },
        { name: 'CSS3' },
        { name: 'Bootstrap' },
        { name: 'ag-grid' }
      ]
    },
    {
      title: 'Development',
      skills: [
        { name: 'JavaScript' },
        { name: 'Git' },
        { name: 'Jasmine' },
        { name: 'Karma' }
      ]
    }
  ];

  // Variation 2: Core to Tools
  variation2Groups: SkillGroup[] = [
    {
      title: 'Core Technologies',
      skills: [
        { name: 'Angular' },
        { name: 'TypeScript' },
        { name: 'RxJs' }
      ]
    },
    {
      title: 'UI & Styling',
      skills: [
        { name: 'Material Design' },
        { name: 'Bootstrap' },
        { name: 'CSS3' },
        { name: 'Responsive Design' }
      ]
    },
    {
      title: 'Developer Tools',
      skills: [
        { name: 'Git' },
        { name: 'Jasmine' },
        { name: 'Karma' },
        { name: 'Jira' }
      ]
    }
  ];

  // Variation 3: Proficiency Based
  variation3Groups: SkillGroup[] = [
    {
      title: 'Expert Level',
      skills: [
        { name: 'Angular' },
        { name: 'TypeScript' },
        { name: 'JavaScript' },
        { name: 'RxJs' },
        { name: 'Material Design' }
      ]
    },
    {
      title: 'Proficient',
      skills: [
        { name: 'Bootstrap' },
        { name: 'Jasmine' },
        { name: 'Karma' },
        { name: 'Chart.js' }
      ]
    },
    {
      title: 'Tools & Platforms',
      skills: [
        { name: 'Git' },
        { name: 'Jira' },
        { name: 'Bamboo' },
        { name: 'NgRx' }
      ]
    }
  ];

  changeVariation(variation: number) {
    this.selectedVariation.set(variation);
    // Use setTimeout with NgZone to avoid change detection issues
    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        this.updateSkillReferences();
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      });
    }, 0);
  }

  getAllSkills(): SkillItem[] {
    return this.activeGroups.flatMap(group => group.skills);
  }

  get activeGroups(): SkillGroup[] {
    switch (this.selectedVariation()) {
      case 1:
        return this.variation1Groups;
      case 2:
        return this.variation2Groups;
      case 3:
        return this.variation3Groups;
      default:
        return this.variation1Groups;
    }
  }
}
