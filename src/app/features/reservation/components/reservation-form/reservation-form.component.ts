import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [ButtonActionComponent, RouterModule],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss'
})
export class ReservationFormComponent {

  constructor(private location: Location){

  }


  goBack(): void {
    this.location.back();
  }

}
