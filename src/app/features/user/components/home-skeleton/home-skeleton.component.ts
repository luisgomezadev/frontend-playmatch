import { Component } from '@angular/core';

@Component({
  selector: 'app-home-skeleton',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col gap-6">
      <!-- Banner: reservas de hoy -->
      <div class="rounded-lg border border-gray-200 bg-white p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4 w-full md:w-auto">
          <div class="shimmer w-14 h-14 rounded-lg shrink-0"></div>
          <div class="flex flex-col gap-2">
            <div class="shimmer h-3 w-32 rounded"></div>
            <div class="flex items-baseline gap-2">
              <div class="shimmer h-7 w-8 rounded"></div>
              <div class="shimmer h-4 w-20 rounded"></div>
            </div>
            <div class="shimmer h-3.5 w-64 rounded hidden md:block"></div>
          </div>
        </div>

        <div class="shimmer h-11 rounded-lg shrink-0 w-full md:w-40"></div>
      </div>

      <!-- Accesos rápidos -->
      <div class="rounded-lg border border-gray-200 bg-white p-6">
        <!-- Header -->
        <div class="flex items-start gap-3 mb-6">
          <div class="shimmer w-10 h-10 rounded-lg shrink-0"></div>
          <div class="flex flex-col gap-2 pt-0.5">
            <div class="shimmer h-4 w-36 rounded"></div>
            <div class="shimmer h-3.5 w-56 rounded"></div>
          </div>
        </div>

        <!-- Cards de accesos -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (item of [1, 2, 3]; track $index) {
            <div class="rounded-lg border border-gray-200 p-5 flex flex-col gap-4">
              <div class="shimmer w-10 h-10 rounded-lg"></div>
              <div class="flex flex-col gap-2">
                <div class="shimmer h-4 w-28 rounded"></div>
                <div class="shimmer h-3.5 w-full rounded"></div>
                <div class="shimmer h-3.5 w-4/5 rounded"></div>
              </div>
              <div class="shimmer h-4 w-14 rounded"></div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class HomeSkeletonComponent {}