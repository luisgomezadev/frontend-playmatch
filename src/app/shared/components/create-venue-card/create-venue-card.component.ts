import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-create-venue-card',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <article
      class="bg-gradient-to-br mt-8 from-gray-50 to-gray-50 border-2 border-gray-100 rounded-xl p-6 transition-all duration-200">
      <div class="mt-2 space-y-4 text-center">
        <h3 class="font-semibold text-gray-800 text-lg">Registra tu complejo deportivo</h3>
        <p class="text-sm text-gray-600 leading-relaxed">
          Aún no tienes canchas registradas. Crea tu centro deportivo con tus canchas para que los
          usuarios puedan reservar en línea.
        </p>

        <div class="w-fit mx-auto">
          <app-button
          (clicked)="goToPage('/dashboard/cancha')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-plus w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Crear Cancha
        </app-button>
        </div>
      </div>
    </article>
  `
})
export class CreateVenueCardComponent {
  private readonly router = inject(Router);

  goToPage(page: string): void {
    this.router.navigate([page]);
  }
}
