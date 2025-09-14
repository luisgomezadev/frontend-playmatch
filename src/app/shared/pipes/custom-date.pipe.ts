import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {
  transform(value: Date | string | null): string {
    if (!value) return '';

    let date: Date;

    if (typeof value === 'string') {
      // Detectar formato YYYY-MM-DD
      const parts = value.split('-');
      if (parts.length === 3) {
        // Crear fecha local (año, mes-1, día)
        const year = +parts[0];
        const month = +parts[1] - 1;
        const day = +parts[2];
        date = new Date(year, month, day); // esto es local
      } else {
        date = new Date(value); // otros formatos
      }
    } else {
      date = value;
    }

    // Obtener nombre del día y del mes en español
    const weekday = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      timeZone: 'America/Bogota'
    });
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'long', timeZone: 'America/Bogota' });

    return `${weekday.toLowerCase()} ${day} de ${month.toLowerCase()}`;
  }
}
