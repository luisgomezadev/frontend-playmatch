import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 1;

  @Output() pageChange = new EventEmitter<number>();

  previous(): void {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  next(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}
