import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-count-reservation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './count-reservation-card.component.html',
  styleUrl: './count-reservation-card.component.scss'
})
export class CountReservationCardComponent {

  @Input() loading = false;
  @Input() value = 0;
  @Input() title = '';
  @Input() color: 'primary' | 'dashblue' | 'dashred' | 'black' = 'black';

}
