import { Component, inject, OnInit, ChangeDetectionStrategy, signal, effect } from '@angular/core';
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

  protected formFilter!: FormGroup;
  protected venues = signal<PagedResponse<Venue>>(createEmptyPagedResponse());
  protected filters = signal<VenueFilter>({});
  protected loading = signal<boolean>(true);
  protected currentPage = signal<number>(0); 
  protected pageSize = signal<number>(6);
  protected showMobileFilters = signal<boolean>(false);

  protected searchForm = new FormGroup({
    name: new FormControl(''),
    city: new FormControl('')
  });

  constructor() {
    effect(() => {
      const currentPage = this.currentPage();
      this.loadVenues(currentPage);
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadVenues(0);
  }

  private initForm(): void {
    this.formFilter = this.formBuilder.group({ name: [''], city: [''] });
  }

  loadVenues(page: number): void {
    this.venueService.getVenues(this.filters(), page, this.pageSize()).subscribe({
      next: data => {
        this.venues.set(data);
      },
      error: err => {
        this.alertService.error('Error cargando canchas', err.error.message || 'Error desconocido');
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  filter(formFilter: VenueFilter): void {
    this.filters.set(formFilter);
    this.loadVenues(0);
  }

  changePage(newPage: number): void {
    const venues = this.venues();
    if (venues !== null && newPage >= 0 && newPage < venues.totalPages) {
      this.currentPage.set(newPage);
    }
  }

  onSearch(): void {
    const formValue = this.searchForm.value;
    
    this.filters.set({
      name: formValue.name || undefined,
      city: formValue.city || undefined
    });

    this.loading.set(true);

    this.venueService.getVenues(this.filters(), 0, this.pageSize()).subscribe({
      next: data => {
        this.venues.set(data);
        this.currentPage.set(0);
      },
      error: err => {
        this.alertService.error(
          'Error al buscar complejos deportivos',
          err.error.message || 'Error desconocido'
        );
      },
      complete: () => {
        this.showMobileFilters.set(false);
        this.loading.set(false);
      }
    });
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.onSearch();
  }

  toggleMobileFilters(): void {
    this.showMobileFilters.update(current => !current);
  }
  
}
