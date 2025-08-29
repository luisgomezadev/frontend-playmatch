import { Component, Input } from '@angular/core';
import { Field } from '@features/field/interfaces/field';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';
import { StatusDescriptionPipe } from '@shared/pipes/status-description.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';

@Component({
  selector: 'app-field-detail-card',
  standalone: true,
  imports: [StatusDescriptionPipe, TimeFormatPipe, MoneyFormatPipe],
  templateUrl: './field-detail-card.component.html',
  styleUrl: './field-detail-card.component.scss'
})
export class FieldDetailCardComponent {
  @Input() field!: Field;
}
