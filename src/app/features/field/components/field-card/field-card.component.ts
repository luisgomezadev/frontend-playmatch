import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';

@Component({
  selector: 'app-field-card',
  standalone: true,
  imports: [ButtonComponent, RouterModule, MoneyFormatPipe],
  templateUrl: './field-card.component.html',
  styleUrl: './field-card.component.scss'
})
export class FieldCardComponent {

}
