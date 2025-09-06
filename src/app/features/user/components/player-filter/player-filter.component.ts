import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserFilter } from '@features/user/interfaces/user';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-player-filter',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './player-filter.component.html',
  styleUrl: './player-filter.component.scss'
})
export class PlayerFilterComponent {
  @Input() formFilter!: FormGroup;
  @Input() showModalFilters = false;
  @Output() closed = new EventEmitter<void>();
  @Output() filter = new EventEmitter<UserFilter>();
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
