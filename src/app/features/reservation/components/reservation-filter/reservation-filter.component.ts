import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';

@Component({
  selector: 'app-reservation-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonActionComponent],
  templateUrl: './reservation-filter.component.html',
  styleUrl: './reservation-filter.component.scss'
})
export class ReservationFilterComponent {
  @Input() formFilter!: FormGroup;
  @Input() showModalFilters = false;
  @Output() close = new EventEmitter<void>();
  @Output() filter = new EventEmitter<any>();
  @Output() cleanFilter = new EventEmitter<void>();

  submitFilter(): void {
    this.filter.emit(this.formFilter.value);
    this.close.emit();
  }

  openModalFilters(): void {
    this.showModalFilters = true;
    document.body.style.overflow = 'hidden';
  }

  closeModalFilters(): void {
    this.close.emit();
  }

  clean(): void {
    this.cleanFilter.emit();
    this.closeModalFilters();
  }
}
