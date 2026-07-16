import { inject, Injectable } from '@angular/core';
import { Venue, VenueFilter, VenueRequest } from '@venue/interfaces/venue';
import { BaseHttpService } from '@shared/data-access/base-http.service';
import { Observable, tap } from 'rxjs';
import { PagedResponse } from '@core/interfaces/paged-response';
import { HttpParams } from '@angular/common/http';
import { CacheService } from '@core/services/cache.service';
import { Field } from '@features/field/interfaces/field';

@Injectable({
  providedIn: 'root'
})
export class VenueService extends BaseHttpService {

  private readonly ENDPOINT = this.apiUrl + '/venue';
  private readonly cacheService = inject(CacheService);

  getVenues(
    filters: VenueFilter,
    page: number,
    size: number
  ): Observable<PagedResponse<Venue>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.name) {
      params = params.set('name', filters.name);
    }

    if (filters.city) {
      params = params.set('city', filters.city);
    }

    const cacheKey = `venues-${JSON.stringify({
      page,
      size,
      ...filters
    })}`;

    return this.cacheService.get(
      cacheKey,
      () => this.http.get<PagedResponse<Venue>>(`${this.ENDPOINT}`, { params })
    );

  }

  getVenueById(id: number): Observable<Venue> {
    return this.http.get<Venue>(`${this.ENDPOINT}/${id}`);
  }

  getMyVenue(): Observable<Venue> {
    return this.http.get<Venue>(`${this.ENDPOINT}/mine`);
  }

  getVenueByCode(code: string): Observable<Venue> {
    return this.http.get<Venue>(`${this.ENDPOINT}/code/${code}`);
  }

  createVenue(venue: VenueRequest): Observable<Venue> {
    return this.http.post<Venue>(this.ENDPOINT, venue).pipe(
      tap(() => this.cacheService.clearByPrefix('venues-'))
    );
  }

  createVenueWithFields(venue: VenueRequest, fields: Field[]): Observable<Venue> {
    const request = {
      venue,
      fields
    };
    return this.http.post<Venue>(`${this.ENDPOINT}/with-fields`, request).pipe(
      tap(() => this.cacheService.clearByPrefix('venues-'))
    );
  }

  updateVenue(venue: VenueRequest, id: number): Observable<Venue> {
    return this.http.put<Venue>(`${this.ENDPOINT}/${id}`, venue).pipe(
      tap(() => this.cacheService.clearByPrefix('venues-'))
    );
  }

}