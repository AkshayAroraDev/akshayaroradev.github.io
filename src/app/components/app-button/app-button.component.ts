import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button 
      [class]="'btn btn--' + variant + ' btn--' + size"
      [attr.aria-label]="label">
      {{ label }}
    </button>
  `,
  styleUrl: './app-button.component.scss'
})
export class AppButtonComponent {
  @Input() label: string = '';
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
