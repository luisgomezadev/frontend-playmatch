import { Component, EventEmitter, Output, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CLASSES_BUTTON,
  STYLE_BLACK,
  STYLE_BLUE,
  STYLE_PRIMARY,
  STYLE_RED,
  STYLE_TRANSPARENT,
  STYLE_YELLOW
} from '@shared/constants/app.constants';

@Component({
  selector: 'app-button',
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
export class ButtonComponent {
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
    let base = CLASSES_BUTTON;
    if (this.onlyIcon) base += ' w-8 h-8 flex items-center justify-center';
    if (!this.disabled && this.color != 'transparent') base += ' hover:shadow';
    else base += ' text-sm w-full';
    const styles = {
      black: STYLE_BLACK,
      red: STYLE_RED,
      primary: STYLE_PRIMARY,
      blue: STYLE_BLUE,
      yellow: STYLE_YELLOW,
      transparent: STYLE_TRANSPARENT
    };
    return `${styles[this.color]} ${base}`;
  }
}
