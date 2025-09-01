import { Component, EventEmitter, Output, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button-action',
  standalone: true,
  imports: [RouterModule],
  template: `
    <button
      [type]="type"
      (click)="handleClick()"
      [disabled]="disabled || loading"
      [class]="classes"
      [class.opacity-50]="loading"
      [class.cursor-not-allowed]="loading"
      [title]="text">
      @if (!loading) {
        @if (hasIcon) {
          <div class="flex items-center justify-center gap-3">
            <i [class]="icon"></i>
            @if (!onlyIcon) {
              <span>{{ text }}</span>
            }
          </div>
        } @else {
          <span>{{ text }}</span>
        }
      } @else {
        <span class="flex items-center gap-2 justify-center">
          {{ text }}
          <svg
            class="animate-spin h-5 w-5 inline-block"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </span>
      }
    </button>
  `
})
export class ButtonActionComponent {
  @Input() text = 'Botón';
  @Input() color: 'black' | 'red' | 'primary' | 'blue' | 'yellow' | 'transparent' = 'black';
  @Input() routerLink: string[] | null = null;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() hasIcon = false;
  @Input() icon = '';
  @Input() onlyIcon = false;

  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    if (!this.routerLink) {
      this.clicked.emit();
    }
  }

  get classes(): string {
    let base =
      'font-medium shadow transition-shadow duration-300 ease-in-out rounded-md disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 px-2 py-1 z-10 relative';
    if (this.onlyIcon) base += ' w-8 h-8 flex items-center justify-center';
    if (!this.disabled && this.color != 'transparent') base += ' hover:shadow';
    else base += ' text-sm w-full';
    const styles = {
      black: 'bg-gray-200 text-black hover:shadow-gray-600',
      red: 'bg-gray-200 text-red-600 hover:shadow-red-600',
      primary: 'bg-gray-200 text-green-800 hover:shadow-green-600',
      blue: 'bg-gray-200 text-blue-600 hover:shadow-blue-600',
      yellow: 'bg-gray-200 text-yellow-500 hover:shadow-yellow-600',
      transparent: 'bg-transparent text-black shadow-none'
    };
    return `${styles[this.color]} ${base}`;
  }
}
