import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-reservation-card-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="space-y-6 p-4 border rounded-md shadow">
      <div class="flex items-center justify-between">
        <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>
        <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/4">
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
      </div>

      <div class="flex items-center justify-between gap-4">
        <div class="flex flex-col space-y-4 flex-1">
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-full">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>

          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-full">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>
        <div class="relative overflow-hidden bg-gray-200 rounded h-12 w-1/3">
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>
      </div>
      <div class="relative overflow-hidden bg-gray-200 rounded h-2 w-3/4">
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
      </div>
    </article>
  `
})
export class LoadingReservationCardComponent {}
