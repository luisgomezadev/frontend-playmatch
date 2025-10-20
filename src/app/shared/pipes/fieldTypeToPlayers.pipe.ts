import { Pipe, PipeTransform } from '@angular/core';
import { FieldType } from '@features/field/interfaces/field';

@Pipe({
  name: 'fieldTypeToPlayers',
  standalone: true
})
export class FieldTypeToPlayersPipe implements PipeTransform {

  transform(value: FieldType): string {
    switch (value) {
      case FieldType.FIVE_A_SIDE:
        return '5 jugadores por equipo';
      case FieldType.SIX_A_SIDE:
        return '6 jugadores por equipo';
      case FieldType.SEVEN_A_SIDE:
        return '7 jugadores por equipo';
      case FieldType.EIGHT_A_SIDE:
        return '8 jugadores por equipo';
      case FieldType.NINE_A_SIDE:
        return '9 jugadores por equipo';
      case FieldType.ELEVEN_A_SIDE:
        return '11 jugadores por equipo';
      default:
        return 'Tipo de campo desconocido';
    }
  }

}
