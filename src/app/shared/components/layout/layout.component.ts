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
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ transform: 'translateY(30px)', opacity: 0 }))
      ])
    ])
  ]

})
export class LayoutComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() loading = false;
}
