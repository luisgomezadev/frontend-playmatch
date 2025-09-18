import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-component',
  standalone: true,
  imports: [],
  template: `
    <div
      class="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-5">
      <img src="assets/icon.webp" alt="Logo PlayMatch" class="w-16 h-auto" />
      <div
        class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent border-r-transparent"></div>

      <span class="text-lg text-slate-700">Accediendo a Play Match</span>
    </div>
  `
})
export class LoadingComponent {}
