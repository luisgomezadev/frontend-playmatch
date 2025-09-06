import { Component, Input } from '@angular/core';
import { Field } from '@features/field/interfaces/field';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';
import { StatusDescriptionPipe } from '@shared/pipes/status-description.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';

@Component({
  selector: 'app-field-info',
  standalone: true,
  imports: [StatusDescriptionPipe, TimeFormatPipe, MoneyFormatPipe],
  templateUrl: './field-info.component.html',
  styleUrl: './field-info.component.scss'
})
export class FieldInfoComponent {
  @Input() field!: Field;
}
