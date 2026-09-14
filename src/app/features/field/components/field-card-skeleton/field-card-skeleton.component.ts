import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-field-card-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
      <div class="flex items-start justify-between gap-4">
        
        <div class="shimmer h-5 w-[70%] rounded"></div>

        <div class="flex flex-col items-end gap-1.5 shrink-0">
          <div class="shimmer h-3 w-14 rounded"></div>
          <div class="shimmer h-5 w-20 rounded"></div>
        </div>
      </div>

      <div class="shimmer h-3.5 w-[45%] rounded mt-3"></div>
    </div>
  `,
})
export class FieldCardSkeletonComponent {}