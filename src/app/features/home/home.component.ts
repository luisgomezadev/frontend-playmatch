import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FieldsListComponent } from '../fields-list/fields-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, FieldsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
