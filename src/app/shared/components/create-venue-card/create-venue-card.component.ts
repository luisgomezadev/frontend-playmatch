import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-venue-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article
      class="bg-gradient-to-br mt-8 from-green-50 to-slate-50 border-2 border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div class="mt-2 space-y-4 text-center">
        <h3 class="font-semibold text-slate-800 text-lg">Registra tu complejo deportivo</h3>
        <p class="text-sm text-slate-600 leading-relaxed">
          Aún no tienes canchas registradas. Crea tu centro deportivo con tus canchas para que los
          usuarios puedan reservar en línea.
        </p>

        <a
          routerLink="/dashboard/cancha"
          class="inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3 rounded-lg transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 shadow-lg text-white">
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
        </a>
      </div>
    </article>
  `
})
export class CreateVenueCardComponent {}
