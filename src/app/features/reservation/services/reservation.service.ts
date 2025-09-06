import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResponse } from '@core/interfaces/paged-response';
import {
  ConfirmedReservation,
  Reservation,
  ReservationFilter,
  ReservationRequest,
  StatusReservation
} from '@reservation/interfaces/reservation';
import { BaseHttpService } from '@shared/data-access/base-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends BaseHttpService {
  private readonly ENDPOINT = this.apiUrl + '/reservation';

  getReservationsByFieldId(fieldId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.ENDPOINT}/field/${fieldId}`);
  }

  getReservationsByUserId(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.ENDPOINT}/user/${userId}`);
  }

  getReservationsByFieldAndStuts(
    fieldId: number,
    status: StatusReservation
  ): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.ENDPOINT}/field/${fieldId}/status/${status}`);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.ENDPOINT}/${id}`);
  }

  createReservation(reservation: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.ENDPOINT}`, reservation);
  }

  finalizeReservationById(id: number): Observable<string> {
    return this.http.put<string>(`${this.ENDPOINT}/${id}/status/finalize`, null);
  }

  canceledReservationById(id: number): Observable<string> {
    return this.http.put<string>(`${this.ENDPOINT}/${id}/status/canceled`, null);
  }

  getCountActiveByUser(userId: number): Observable<number> {
    return this.http.get<number>(`${this.ENDPOINT}/user/${userId}/active`);
  }

  getCountActiveByField(fieldId: number): Observable<number> {
    return this.http.get<number>(`${this.ENDPOINT}/field/${fieldId}/active`);
  }

  getCountFinishedByField(fieldId: number): Observable<number> {
    return this.http.get<number>(`${this.ENDPOINT}/field/${fieldId}/finished`);
  }

  getCountCanceledByField(fieldId: number): Observable<number> {
    return this.http.get<number>(`${this.ENDPOINT}/field/${fieldId}/canceled`);
  }

  getReservationFiltered(
    filters: ReservationFilter,
    page: number,
    size: number
  ): Observable<PagedResponse<Reservation>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (filters.date) {
      params = params.set('date', filters.date);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.userId != null) {
      params = params.set('userId', filters.userId.toString());
    }
    if (filters.fieldId != null) {
      params = params.set('fieldId', filters.fieldId.toString());
    }
    return this.http.get<PagedResponse<Reservation>>(`${this.ENDPOINT}`, { params });
  }

  getReservationAvailability(reservation: ReservationRequest): Observable<ConfirmedReservation> {
    return this.http.post<ConfirmedReservation>(`${this.ENDPOINT}/availability`, reservation);
  }

  getLastThreeReservationsByField(fieldId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.ENDPOINT}/latest/${fieldId}`);
  }
}
