import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldType',
  standalone: true
})
export class FieldTypePipe implements PipeTransform {
  private readonly map: Record<string, string> = {
    'FIVE_A_SIDE': 'Fútbol 5',
    'SIX_A_SIDE': 'Fútbol 6',
    'SEVEN_A_SIDE': 'Fútbol 7',
    'EIGHT_A_SIDE': 'Fútbol 8',
    'NINE_A_SIDE': 'Fútbol 9',
    'ELEVEN_A_SIDE': 'Fútbol 11'
  };

  transform(value: string | null | undefined): string {
    if (!value) return '';
    return this.map[value] ?? value;
  }
}
