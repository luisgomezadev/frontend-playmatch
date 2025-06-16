import { Component, EventEmitter, Output, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'button-action',
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
    >
      @if(!loading) {
      <span>{{ text }}</span>
      } @else {
      <span class="flex items-center gap-2 justify-center">
        {{ text }}
        <svg
          class="animate-spin h-5 w-5 inline-block"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </span>
      }
    </button>
  `,
})
export class ButtonActionComponent {
  @Input() text: string = 'Botón';
  @Input() color: 'black' | 'red' | 'primary' | 'blue' = 'black';
  @Input() routerLink: string | any[] | null = null;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() loading: boolean = false;
  @Input() withIcon: boolean = false;
  @Input() disabled: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    if (!this.routerLink) {
      this.clicked.emit();
    }
  }

  get classes(): string {
    let base =
      'text-sm font-semibold px-4 py-2 rounded-xl transition-all w-full';
    if (this.withIcon) base += ' pl-8';
    if (!this.disabled) base += ' hover:scale-[1.03]';
    const styles = {
      black: 'bg-black/70 text-white hover:bg-black/90',
      red: 'bg-red-600/70 text-white hover:bg-red-600/90',
      primary: 'bg-primary/70 text-white hover:bg-primary/90',
      blue: 'bg-blue-600/70 text-white hover:bg-blue-600/90',
    };
    return `${styles[this.color]} ${base}`;
  }
}
