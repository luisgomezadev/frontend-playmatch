import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedResponse } from '@core/interfaces/paged-response';
import { AlertService } from '@core/services/alert.service';
import { VenueCardComponent } from '@features/venue/components/venue-card/venue-card.component';
import { Venue, VenueFilter } from '@features/venue/interfaces/venue';
import { VenueService } from '@features/venue/services/venue.service';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-venue-list',
  standalone: true,
  imports: [VenueCardComponent, PaginationComponent, NavbarComponent, RouterLink],
  templateUrl: './venue-list.component.html',
  styleUrl: './venue-list.component.scss'
})
export class VenueListComponent implements OnInit {
  private readonly venueService = inject(VenueService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertService = inject(AlertService);

  formFilter!: FormGroup;
  venues!: PagedResponse<Venue>;
  filters: VenueFilter = {};
  loading = false;
  pageSize = 12;
  currentPage = 0;

  ngOnInit(): void {
    this.initForm();
    this.loadVenues(0);
  }

  private initForm(): void {
    this.formFilter = this.formBuilder.group({ name: [''], city: [''] });
  }

  loadVenues(page: number): void {
    this.loading = true;
    this.venueService.getVenues(this.filters, page, this.pageSize).subscribe({
      next: data => {
        this.loading = false;
        this.venues = data;
      },
      error: err => {
        this.loading = false;
        this.alertService.error('Error cargando canchas', err.error.message || 'Error desconocido');
      }
    });
  }

  filter(formFilter: VenueFilter): void {
    this.filters = formFilter;
    this.loadVenues(0);
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.venues.totalPages) {
      this.currentPage = newPage;
      this.loadVenues(this.currentPage);
    }
  }
}
