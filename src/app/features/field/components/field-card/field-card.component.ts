import { Component, Input } from '@angular/core';
import { Field } from '@field/interfaces/field';
import { ButtonActionComponent } from '@shared/components/button-action/button-action.component';

@Component({
  selector: 'app-field-card',
  standalone: true,
  imports: [ButtonActionComponent],
  templateUrl: './field-card.component.html',
  styleUrl: './field-card.component.scss'
})
export class FieldCardComponent {
  @Input() field!: Field;
}
