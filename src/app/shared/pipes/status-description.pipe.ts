import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusDescription',
  standalone: true
})
export class StatusDescriptionPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'ACTIVE': return 'Activa';
      case 'INACTIVE': return 'Inactiva';
      default: return value;
    }
  }
}
