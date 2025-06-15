import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusReservation',
  standalone: true
})
export class StatusReservationPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'ACTIVE': return 'Reserva activa';
      case 'FINISHED': return 'Reserva finalizada';
      case 'CANCELED': return 'Reserva cancelada';
      default: return value;
    }
  }
}