import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-full-component',
  standalone: true,
  imports: [],
  template: `
    <div
      class="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center"
    >
      <h1 class="text-2xl font-bold text-primary mb-4">PlayMatch</h1>
      <div
        class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"
      ></div>

      <h2 class="text-lg text-gray-700">
        {{ text || 'Cargando...' }}{{ dots }}
      </h2>
    </div>
  `,
})
export class LoadingFullComponent {
  @Input() text: string = 'Cargando';
  dots: string = '';
  private intervalId: any;

  ngOnInit(): void {
    let count = 0;
    this.intervalId = setInterval(() => {
      count = (count + 1) % 4;
      this.dots = '.'.repeat(count);
    }, 500);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
