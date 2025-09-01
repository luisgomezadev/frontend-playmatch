import { Component } from '@angular/core';
import { FieldsListComponent } from '../../features/field/components/fields-list/fields-list.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FieldsListComponent, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
