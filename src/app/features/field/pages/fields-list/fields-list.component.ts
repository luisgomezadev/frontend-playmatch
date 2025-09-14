import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FieldFilterComponent } from '@features/field/components/field-filter/field-filter.component';
import { FieldCardComponent } from '@field/components/field-card/field-card.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';

@Component({
  selector: 'app-fields-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FieldCardComponent,
    ReactiveFormsModule,
    ButtonComponent,
    LayoutComponent,
    FieldFilterComponent,
    MoneyFormatPipe,
    PaginationComponent
  ],
  templateUrl: './fields-list.component.html',
  styleUrl: './fields-list.component.scss'
})
export class FieldsListComponent {
}
