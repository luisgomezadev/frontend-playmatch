import { Injectable } from '@angular/core';
import { Venue, VenueFilter, VenueRequest } from '@venue/interfaces/venue';
import { BaseHttpService } from '@shared/data-access/base-http.service';
import { Observable } from 'rxjs';
import { PagedResponse } from '@core/interfaces/paged-response';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VenueService extends BaseHttpService {
  private readonly ENDPOINT = this.apiUrl + '/venue';

  getVenues(
    filters: VenueFilter,
    page: number,
    size: number
  ): Observable<PagedResponse<Venue>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.city) {
      params = params.set('city', filters.city);
    }
    return this.http.get<PagedResponse<Venue>>(`${this.ENDPOINT}`, { params });
  }

  getVenueById(id: number): Observable<Venue> {
    return this.http.get<Venue>(`${this.ENDPOINT}/${id}`);
  }

  getVenueByAdminId(id: number): Observable<Venue> {
    return this.http.get<Venue>(`${this.ENDPOINT}/admin/${id}`);
  }

  getVenueByCode(code: string): Observable<Venue> {
    return this.http.get<Venue>(`${this.ENDPOINT}/code/${code}`);
  }

  createVenue(venue: VenueRequest): Observable<Venue> {
    return this.http.post<Venue>(`${this.ENDPOINT}`, venue);
  }

  updateVenue(venue: VenueRequest): Observable<Venue> {
    return this.http.put<Venue>(`${this.ENDPOINT}`, venue);
  }
}
