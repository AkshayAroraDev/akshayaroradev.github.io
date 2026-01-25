import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ViewChildren, ElementRef, AfterViewInit, QueryList, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxConnectionBeamComponent } from '@omnedia/ngx-connection-beam';
import { NgxTypewriterComponent } from '@omnedia/ngx-typewriter';
import { SkillItem, SkillGroup } from '../../models';
import skillsData from '../../../json/skills.json';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, NgxConnectionBeamComponent, NgxTypewriterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app-skills.component.html',
  styleUrl: './app-skills.component.scss'
})
export class AppSkillsComponent implements AfterViewInit {
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
      const leftSkills = this.skillGroups[0].skills;
      const rightSkills = this.skillGroups[1].skills;
      
      let elementIndex = 0;
      
      // Map left group - get the badge element inside
      for (let i = 0; i < leftSkills.length; i++) {
        const element = this.skillElements.get(elementIndex);
        if (element && leftSkills[i]) {
          const badgeElement = element.nativeElement.querySelector('.skills__skill-badge');
          this.skillRefs[leftSkills[i].name] = badgeElement || element.nativeElement;
        }
        elementIndex++;
      }
      
      // Map right group - get the badge element inside
      for (let i = 0; i < rightSkills.length; i++) {
        const element = this.skillElements.get(elementIndex);
        if (element && rightSkills[i]) {
          const badgeElement = element.nativeElement.querySelector('.skills__skill-badge');
          this.skillRefs[rightSkills[i].name] = badgeElement || element.nativeElement;
        }
        elementIndex++;
      }
    }
  }

  skillGroups: SkillGroup[] = skillsData.skillGroups as SkillGroup[];
}
