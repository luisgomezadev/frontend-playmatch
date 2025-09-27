import { Component, EventEmitter, Output, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterModule],
  template: `
    <button
      [type]="type"
      (click)="handleClick()"
      [disabled]="disabled"
      [class]="classes"
      [title]="text">
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() text = '';
  @Input() color: 'primary' | 'secondary' = 'primary';
  @Input() size: 'big' | 'small' = 'small';
  @Input() routerLink: string[] | null = null;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;

  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    this.clicked.emit();
  }

  get classes(): string {
    let base =
      'w-full inline-flex items-center justify-center gap-2 hover:shadow-md transform transition-all duration-300 disabled:opacity-60 disabled:hover:shadow-none';

    if (this.size === 'big') base += ' py-4 px-6 sm:px-10 font-semibold text-lg rounded-2xl';
    else base += ' px-4 py-2 font-medium rounded-lg';

    if (this.color === 'primary') {
      return base + ' bg-primary text-white';
    }
    return base + ' bg-secondary text-black';
  }
}
