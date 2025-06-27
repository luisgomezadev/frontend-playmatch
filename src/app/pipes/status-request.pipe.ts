import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusRequest',
  standalone: true
})
export class StatusRequestPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'ACCEPTED': return 'Aceptada';
      case 'REJECTED': return 'Rechazada';
      case 'PENDING': return 'Pendiente';
      default: return value;
    }
  }
}