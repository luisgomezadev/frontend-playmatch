// field-management-skeleton.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-field-management-skeleton',
  standalone: true,
  imports: [],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Panel izquierdo: formulario -->
      <div>
        <!-- Header con ícono -->
        <div class="flex items-start gap-3 mb-6">
          <div class="shimmer w-11 h-11 rounded-lg shrink-0"></div>
          <div class="flex flex-col gap-2 pt-0.5 flex-1">
            <div class="shimmer h-4 w-48 rounded"></div>
            <div class="shimmer h-3 w-56 rounded"></div>
          </div>
        </div>

        <!-- Nombre de la cancha -->
        <div class="flex flex-col gap-2 mb-5">
          <div class="shimmer h-3.5 w-32 rounded"></div>
          <div class="shimmer h-11 w-full rounded-lg"></div>
        </div>

        <!-- Precio por hora -->
        <div class="flex flex-col gap-2 mb-5">
          <div class="shimmer h-3.5 w-28 rounded"></div>
          <div class="shimmer h-11 w-full rounded-lg"></div>
        </div>

        <!-- Tipo de cancha -->
        <div class="flex flex-col gap-2 mb-6">
          <div class="shimmer h-3.5 w-24 rounded"></div>
          <div class="flex flex-wrap gap-2">
            @for (item of [1, 2, 3, 4, 5, 6]; track $index) {
              <div class="shimmer h-9 w-20 rounded-lg"></div>
            }
          </div>
        </div>

        <!-- Botón agregar -->
        <div class="shimmer h-12 w-full rounded-lg"></div>
      </div>

      <!-- Panel derecho: lista de canchas -->
      <div>
        <!-- Header con contador -->
        <div class="flex items-center gap-2.5 mb-5">
          <div class="shimmer h-4 w-40 rounded"></div>
          <div class="shimmer h-5 w-20 rounded-full"></div>
        </div>

        <!-- Items de la lista -->
        <div class="flex flex-col gap-3">
          @for (item of [1, 2, 3]; track $index) {
            <div class="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4">
              <div class="flex flex-col gap-2 min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <div class="shimmer h-4 w-36 rounded"></div>
                  <div class="shimmer h-4 w-14 rounded-full"></div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="shimmer h-5 w-16 rounded"></div>
                  <div class="shimmer h-4 w-24 rounded"></div>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <div class="shimmer h-9 w-20 rounded-lg"></div>
                <div class="shimmer h-9 w-24 rounded-lg"></div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class FieldManagementSkeletonComponent {}