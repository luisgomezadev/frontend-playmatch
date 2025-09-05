import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusReservation',
  standalone: true
})
export class StatusReservationPipe implements PipeTransform {
  transform(value: string | undefined): string {
    switch (value) {
      case 'ACTIVE': return 'Activa';
      case 'FINISHED': return 'Finalizada';
      case 'CANCELED': return 'Cancelada';
      default: return 'Desconocido';
    }
  }
}
