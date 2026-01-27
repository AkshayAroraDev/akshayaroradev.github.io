import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button 
      [class]="'btn btn--' + variant() + ' btn--' + size()"
      [attr.aria-label]="label()"
      (click)="onClick.emit()">
      {{ label() }}
    </button>
  `,
  styleUrl: './app-button.component.scss'
})
export class AppButtonComponent {
  label = input('');
  variant = input<'primary' | 'secondary' | 'outline'>('primary');
  size = input<'small' | 'medium' | 'large'>('medium');
  onClick = output<void>();
}
