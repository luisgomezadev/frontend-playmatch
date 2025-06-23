import { Component, Input } from "@angular/core";

@Component({
  selector: 'loading-component',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col gap-3 justify-center items-center mt-6">
      <h2 class="text-lg text-gray-600">
        {{ text }}{{ dots }}
      </h2>
    </div>
  `,
})
export class LoadingComponent {
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