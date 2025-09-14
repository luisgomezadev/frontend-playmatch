import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';

@Component({
  selector: 'app-field-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, LayoutComponent],
  templateUrl: './field-form.component.html',
  styleUrl: './field-form.component.scss'
})
export class FieldFormComponent {

}
