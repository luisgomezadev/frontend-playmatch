import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  animations: [
    trigger('slideInOut', [
      // Estado de entrada: entra solo un poco desde la izquierda
      transition(':enter', [
        style({ transform: 'translateX(-30px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      // Estado de salida: se va hacia la izquierda
      transition(':leave', [
        animate('400ms ease-in', style({ transform: 'translateX(-30px)', opacity: 0 }))
      ])
    ])
  ]

})
export class LayoutComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() loading = false;
}
