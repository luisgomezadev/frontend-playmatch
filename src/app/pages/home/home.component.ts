import { Component } from '@angular/core';
import { FieldsListComponent } from '../../features/field/components/fields-list/fields-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FieldsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
