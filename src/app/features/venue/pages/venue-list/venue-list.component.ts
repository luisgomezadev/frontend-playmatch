import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createEmptyPagedResponse, PagedResponse } from '@core/interfaces/paged-response';
import { AlertService } from '@core/services/alert.service';
import { VenueCardComponent } from '@features/venue/components/venue-card/venue-card.component';
import { Venue, VenueFilter } from '@features/venue/interfaces/venue';
import { VenueService } from '@features/venue/services/venue.service';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { VenueCardSkeletonComponent } from '@features/venue/components/venue-card-skeleton/venue-card-skeleton.component';

@Component({
  selector: 'app-venue-list',
  standalone: true,
  imports: [
    VenueCardComponent,
    PaginationComponent,
    NavbarComponent,
    RouterLink,
    ReactiveFormsModule,
    VenueCardSkeletonComponent
  ],
  templateUrl: './venue-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './venue-list.component.scss'
})
export class VenueListComponent implements OnInit {
  private readonly venueService = inject(VenueService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertService = inject(AlertService);

  formFilter!: FormGroup;
  venues = signal<PagedResponse<Venue>>(createEmptyPagedResponse());
  filters: VenueFilter = {};
  loading = signal<boolean>(true);
  pageSize = 12;
  currentPage = 0;
  showMobileFilters = false;

  searchForm = new FormGroup({
    name: new FormControl(''),
    city: new FormControl('')
  });

  ngOnInit(): void {
    this.initForm();
    this.loadVenues(0);
  }

  private initForm(): void {
    this.formFilter = this.formBuilder.group({ name: [''], city: [''] });
  }

  loadVenues(page: number): void {
    this.venueService.getVenues(this.filters, page, this.pageSize).subscribe({
      next: data => {
        this.loading.set(false);
        this.venues.set(data);
      },
      error: err => {
        this.loading.set(false);
        this.alertService.error('Error cargando canchas', err.error.message || 'Error desconocido');
      }
    });
  }

  filter(formFilter: VenueFilter): void {
    this.filters = formFilter;
    this.loadVenues(0);
  }

  changePage(newPage: number): void {
    const venues = this.venues();
    if (venues !== null && newPage >= 0 && newPage < venues.totalPages) {
      this.currentPage = newPage;
      this.loadVenues(this.currentPage);
    }
  }

  onSearch() {
    const formValue = this.searchForm.value;
    this.filters = {
      name: formValue.name || undefined,
      city: formValue.city || undefined
    };

    this.loading.set(true);

    this.venueService.getVenues(this.filters, 0, this.pageSize).subscribe({
      next: data => {
        this.venues.set(data);
        this.currentPage = 0;
      },
      error: err => {
        this.alertService.error(
          'Error al buscar complejos deportivos',
          err.error.message || 'Error desconocido'
        );
      },
      complete: () => {
        this.showMobileFilters = false;
        this.loading.set(false);
      }
    });
  }

  clearSearch() {
    this.searchForm.reset();
    this.onSearch();
  }
}
