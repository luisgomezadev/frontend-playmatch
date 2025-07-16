import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ConfirmedReservation, Reservation, StatusReservation } from '../interfaces/reservation';
import { ReservationFilter } from '../interfaces/reservation';
import { PagedResponse } from '../../../core/interfaces/paged-response';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private url = environment.apiUrl + '/reservation';

  constructor(private http: HttpClient) {}

  getReservations(): Observable<any> {
    return this.http.get(`${this.url}`);
  }

  getReservationsByFieldId(fieldId: number): Observable<any> {
    return this.http.get(`${this.url}/field/${fieldId}`);
  }

  getReservationsByTeamId(teamId: number): Observable<any> {
    return this.http.get(`${this.url}/team/${teamId}`);
  }

  getReservationsByFieldAndStuts(fieldId: number, status: StatusReservation): Observable<any> {
    return this.http.get(`${this.url}/field/${fieldId}/status/${status}`);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.url}/${id}`);
  }

  createReservation(reservation: any): Observable<any> {
    return this.http.post(`${this.url}`, reservation);
  }

  updateReservation(reservation: any): Observable<any> {
    return this.http.put(`${this.url}`, reservation);
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  finalizeReservationById(id: number): Observable<any> {
    return this.http.put(`${this.url}/${id}/status/finalize`, null);
  }

  canceledReservationById(id: number): Observable<any> {
    return this.http.put(`${this.url}/${id}/status/canceled`, null);
  }

  getCountActiveByTeam(teamId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/team/${teamId}/active`);
  }

  getCountFinishedByTeam(teamId: number): Observable<any> {
    return this.http.get(`${this.url}/team/${teamId}/finished`);
  }

  getCountActiveByField(fieldId: number): Observable<any> {
    return this.http.get(`${this.url}/field/${fieldId}/active`);
  }

  getCountFinishedByField(fieldId: number): Observable<any> {
    return this.http.get(`${this.url}/field/${fieldId}/finished`);
  }

  getCountCanceledByField(fieldId: number): Observable<any> {
    return this.http.get(`${this.url}/field/${fieldId}/canceled`);
  }

  getReservationFiltered(filters: ReservationFilter, page: number, size: number): Observable<PagedResponse<Reservation>> {
    let params = new HttpParams();

    if (filters.date) {
      params = params.set('date', filters.date);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.teamId != null) {
      params = params.set('teamId', filters.teamId.toString());
    }
    if (filters.fieldId != null) {
      params = params.set('fieldId', filters.fieldId.toString());
    }
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());
    return this.http.get<PagedResponse<Reservation>>(`${this.url}/filter`, { params });
  }

  getReservationAvailability(
    reservation: any
  ): Observable<ConfirmedReservation> {
    return this.http.post<ConfirmedReservation>(
      `${this.url}/availability`,
      reservation
    );
  }
}
