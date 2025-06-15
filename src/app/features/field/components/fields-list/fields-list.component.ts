import { Component, Input } from '@angular/core';
import { Field } from '../../interfaces/field';
import { FieldService } from '../../services/field.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { User } from '../../../../core/interfaces/user';

@Component({
  selector: 'app-fields-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './fields-list.component.html',
  styleUrl: './fields-list.component.scss'
})
export class FieldsListComponent {

  fields: Field[] = [];
  user!: User;
  loading = false;

  @Input() showHeader: boolean = true;

  constructor(private fieldService: FieldService, private authService: AuthService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['showHeader'] !== undefined) {
        this.showHeader = params['showHeader'] !== 'false';
      }
    });
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    console.log(this.user)
    this.loadFields();
  }

  loadFields() {
    this.loading = true;
    this.fields = [];
    this.fieldService.getFields().subscribe({
      next: (data) => {
        this.loading = false;
        this.fields = data;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error cargando campos', err.error.errorMessage || 'Error desconocido');
      }
    });
  }

}
