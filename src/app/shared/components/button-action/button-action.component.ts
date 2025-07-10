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
      @if(!loading) { @if (hasIcon) {
      <div class="flex items-center gap-3">
        <i [class]="icon"></i>
        @if(!onlyIcon) {<span>{{ text }}</span
        >}
      </div>
      } @else {
      <span>{{ text }}</span>
      } } @else {
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
  @Input() color: 'black' | 'red' | 'primary' | 'blue' | 'yellow' = 'black';
  @Input() routerLink: string | any[] | null = null;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hasIcon: boolean = false;
  @Input() icon: string = '';
  @Input() onlyIcon: boolean = false;
  @Input() bigButton: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    if (!this.routerLink) {
      this.clicked.emit();
    }
  }

  get classes(): string {
    let base =
      'font-semibold shadow-md transition-all duration-200 ease-in-out rounded-md md:rounded-xl disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 px-3 py-2';
    if (this.onlyIcon) base += ' w-8 h-8 flex items-center justify-center';
    if (!this.disabled) base += 'hover:shadow-lg hover:-translate-y-0.5';
    if (this.bigButton)
      base += ' text-lg rounded-full border-2 border-gray-500';
    else
      base +=
        ' text-sm w-full';
    const styles = {
      black: 'bg-black text-white hover:shadow-gray-600',
      red: 'bg-red-600 text-white hover:shadow-red-600',
      primary: 'bg-primary text-white hover:shadow-green-600',
      blue: 'bg-blue-600 text-white hover:shadow-blue-600',
      yellow: 'bg-yellow-500 text-white hover:shadow-yellow-600',
    };
    return `${styles[this.color]} ${base}`;
  }
}
