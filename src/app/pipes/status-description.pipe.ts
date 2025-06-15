import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusDescription',
  standalone: true
})
export class StatusDescriptionPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'ACTIVE': return 'ACTIVO';
      case 'INACTIVE': return 'INACTIVO';
      default: return value;
    }
  }
}