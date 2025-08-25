import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyFormat',
  standalone: true
})
export class MoneyFormatPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value == null || isNaN(Number(value))) return '';

    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    };

    return new Intl.NumberFormat('es-CO', options)
      .format(Number(value))
      .replace('COP', '$');
  }

}
