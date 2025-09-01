import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-field-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 p-4 border rounded-md shadow">
      <div class="relative overflow-hidden bg-gray-200 rounded h-6 w-1/3">
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
        <div
          class="relative overflow-hidden bg-gray-200 rounded h-16 w-full col-span-1 md:col-span-2">
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>
        @for (item of placeholders; track $index) {
          <div class="relative overflow-hidden bg-gray-200 rounded h-16 w-full">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        }
      </div>
    </div>
  `
})
export class LoadingFieldComponent {
  placeholders = Array(6);
}
