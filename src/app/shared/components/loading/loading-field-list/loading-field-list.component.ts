import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'loading-field-list-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article class="space-y-6 p-4 border rounded-md shadow">
        <div class="relative overflow-hidden bg-gray-200 rounded h-48 w-full">
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>

        <div class="flex justify-center">
          <div class="relative overflow-hidden bg-gray-200 rounded h-8 w-3/4">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-3/4">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </article>
      <article class="space-y-6 p-4 border rounded-md shadow">
        <div class="relative overflow-hidden bg-gray-200 rounded h-48 w-full">
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>

        <div class="flex justify-center">
          <div class="relative overflow-hidden bg-gray-200 rounded h-8 w-3/4">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-3/4">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </article>
      <article class="space-y-6 p-4 border rounded-md shadow hidden md:block">
        <div class="relative overflow-hidden bg-gray-200 rounded h-48 w-full">
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>

        <div class="flex justify-center">
          <div class="relative overflow-hidden bg-gray-200 rounded h-8 w-3/4">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-3/4">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
          <div class="relative overflow-hidden bg-gray-200 rounded h-4 w-1/2">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </article>
    </div>
  `
})
export class LoadingFieldListComponent {}
