import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.loading$ | async" class="loading-bar-container">
      <div class="loading-bar"></div>
    </div>
  `,
  styles: [`
    .loading-bar-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      overflow: hidden;
      background: transparent;
      z-index: 9999;
    }

    .loading-bar {
      height: 100%;
      width: 40%;
      background: #00BF63;
      animation: indeterminate 1.5s infinite ease-in-out;
    }

    @keyframes indeterminate {
      0% {
        transform: translateX(-100%);
      }
      50% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(200%);
      }
    }
  `]
})
export class LoadingBarComponent {
  loadingService: LoadingService = inject(LoadingService);
}
