import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-field-filter',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './field-filter.component.html',
  styleUrl: './field-filter.component.scss'
})
export class FieldFilterComponent {

}
