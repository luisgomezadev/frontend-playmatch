import { Component, EventEmitter, Output, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CLASSES_BUTTON,
  STYLE_BLACK,
  STYLE_BLUE,
  STYLE_PRIMARY,
  STYLE_RED,
  STYLE_TRANSPARENT,
  STYLE_WHITE,
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
            @if (color === 'white') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-filter-2">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 6h16" />
                <path d="M6 12h12" />
                <path d="M9 18h6" />
              </svg>
            } @else {
              <i [class]="icon"></i>
            }
            @if (!onlyIcon) {
              <span class="tracking-wide">{{ text }}</span>
            }
          </div>
        } @else {
          <span class="tracking-wide">{{ text }}</span>
        }
      } @else {
        <span class="flex items-center gap-2 justify-center">
          {{ text }}
          <svg
            class="animate-spin h-4 w-4 inline-block"
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
  @Input() color: 'black' | 'red' | 'primary' | 'blue' | 'yellow' | 'transparent' | 'white' =
    'black';
  @Input() routerLink: string[] | null = null;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() hasIcon = false;
  @Input() icon = '';
  @Input() onlyIcon = false;
  @Input() class = '';

  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    if (!this.routerLink) {
      this.clicked.emit();
    }
  }

  get classes(): string {
    let base = CLASSES_BUTTON + ' ' + this.class;
    if (this.onlyIcon) base += ' w-8 h-8 flex items-center justify-center';
    const styles = {
      black: STYLE_BLACK,
      red: STYLE_RED,
      primary: STYLE_PRIMARY,
      blue: STYLE_BLUE,
      yellow: STYLE_YELLOW,
      transparent: STYLE_TRANSPARENT,
      white: STYLE_WHITE
    };
    return `${styles[this.color]} ${base}`;
  }
}
