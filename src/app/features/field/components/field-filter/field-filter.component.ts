import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldFilter } from '@features/field/interfaces/field';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-field-filter',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './field-filter.component.html',
  styleUrl: './field-filter.component.scss'
})
export class FieldFilterComponent {
  @Input() formFilter!: FormGroup;
  @Input() showModalFilters = false;
  @Output() closed = new EventEmitter<void>();
  @Output() filter = new EventEmitter<FieldFilter>();
  @Output() cleanFilter = new EventEmitter<void>();

  submitFilter(): void {
    this.filter.emit(this.formFilter.value);
    this.closed.emit();
  }

  openModalFilters(): void {
    this.showModalFilters = true;
    document.body.style.overflow = 'hidden';
  }

  closeModalFilters(): void {
    this.closed.emit();
  }

  clean(): void {
    this.cleanFilter.emit();
    this.closeModalFilters();
  }
}
