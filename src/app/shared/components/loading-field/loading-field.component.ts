import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'loading-field-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-3/4 mb-8">
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
      </div>
    </div>
    <div class="relative overflow-hidden bg-gray-200 rounded h-3 w-1/2 mb-8">
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-6 p-4 border rounded-md shadow">
        <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-3/4">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
          </div>
        </div>
        <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
          </div>
        </div>
        <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-3/4">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
          </div>
        </div>
        <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
          </div>
        </div>
        <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
          </div>
        </div>

        <div class="relative overflow-hidden bg-gray-200 rounded h-10 w-full">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
          </div>
        </div>
      </div>
      <div class="space-y-6 p-4 border rounded-md shadow">

        <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-3/4">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
          </div>
        </div>

        <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
          </div>
        </div>

        <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-3/4">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
          </div>
        </div>

        <div class="relative overflow-hidden bg-gray-200 rounded h-28 w-full">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer">
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoadingFieldComponent {

}
