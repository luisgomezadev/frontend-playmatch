import { Pipe, PipeTransform } from '@angular/core';
import { ReservationDuration } from '@features/reservation/interfaces/reservation';

const DURATION_LABELS: Record<ReservationDuration, string> = {
  [ReservationDuration.MIN_60]: '1 hora',
  [ReservationDuration.MIN_90]: '1 hora y media',
  [ReservationDuration.MIN_120]: '2 horas',
  [ReservationDuration.MIN_150]: '2 horas y media',
  [ReservationDuration.MIN_180]: '3 horas'
};

@Pipe({
  name: 'durationLabel',
  standalone: true
})
export class DurationLabelPipe implements PipeTransform {
  transform(value: ReservationDuration): string {
    return DURATION_LABELS[value] ?? value;
  }
}