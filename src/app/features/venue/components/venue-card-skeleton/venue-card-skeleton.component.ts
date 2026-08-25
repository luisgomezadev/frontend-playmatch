import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-venue-card-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <!-- Imagen con badge y ojo superpuestos -->
      <div class="relative">
        <div class="shimmer w-full h-40"></div>

        <!-- Badge "Disponible" -->
        <div class="absolute top-3 left-3">
          <div class="shimmer w-[90px] h-6 rounded-full"></div>
        </div>

        <!-- Ícono de ojo -->
        <div class="absolute top-3 right-3">
          <div class="shimmer w-7 h-7 rounded-full"></div>
        </div>
      </div>

      <!-- Contenido de texto -->
      <div class="p-4 flex flex-col gap-3">
        <!-- Título -->
        <div class="shimmer h-5 w-[65%] rounded"></div>

        <!-- Ubicación (pin + texto) -->
        <div class="flex items-center gap-2">
          <div class="shimmer w-3.5 h-3.5 rounded-full shrink-0"></div>
          <div class="shimmer h-3.5 w-[80%] rounded"></div>
        </div>

        <!-- Botón -->
        <div class="shimmer h-[38px] w-full rounded-lg mt-1"></div>
      </div>
    </div>
  `,
})
export class VenueCardSkeletonComponent {}