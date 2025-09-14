import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldType',
  standalone: true
})
export class FieldTypePipe implements PipeTransform {
  private readonly map: Record<string, string> = {
    'FIVE_A_SIDE': '5v5',
    'SIX_A_SIDE': '6v6',
    'SEVEN_A_SIDE': '7v7',
    'EIGHT_A_SIDE': '8v8',
    'NINE_A_SIDE': '9v9',
    'ELEVEN_A_SIDE': '11v11'
  };

  transform(value: string | null | undefined): string {
    if (!value) return '';
    return this.map[value] ?? value;
  }
}
