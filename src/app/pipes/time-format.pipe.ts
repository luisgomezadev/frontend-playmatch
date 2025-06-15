import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const [hours, minutes] = value.split(':').map(Number);

    const suffix = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;

    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  }

}