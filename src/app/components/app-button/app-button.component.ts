import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button 
      [class]="'btn btn--' + variant + ' btn--' + size"
      [attr.aria-label]="label"
      (click)="onClick.emit()">
      {{ label }}
    </button>
  `,
  styleUrl: './app-button.component.scss'
})
export class AppButtonComponent {
  @Input() label: string = '';
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() onClick = new EventEmitter<void>();
}
