import { Component } from '@angular/core';
import { Field } from '../../core/models/field';
import { FieldService } from '../../core/services/field.service';

@Component({
  selector: 'app-fields-list',
  standalone: true,
  imports: [],
  templateUrl: './fields-list.component.html',
  styleUrl: './fields-list.component.scss'
})
export class FieldsListComponent {

  fields: Field[] = [];
  loading = false;

  constructor(private fieldService: FieldService) {
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
