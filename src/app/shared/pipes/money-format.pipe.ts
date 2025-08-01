import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyFormat',
  standalone: true
})
export class MoneyFormatPipe implements PipeTransform {

  transform(value: number | string, currencySymbol: string = '$', decimal: boolean = false): string {
    if (value == null || isNaN(Number(value))) return '';

    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: decimal ? 2 : 0,
      maximumFractionDigits: decimal ? 2 : 0,
      currencyDisplay: 'symbol'
    };

    return new Intl.NumberFormat('es-CO', options)
      .format(Number(value))
      .replace('COP', currencySymbol);
  }

}