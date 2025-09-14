import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation, ReservationRequest, TimeSlot } from '@reservation/interfaces/reservation';
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

  getReservationsByVenueId(venueId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.ENDPOINT}/venue/${venueId}`);
  }

  getReservationByCode(code: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.ENDPOINT}/code/${code}`);
  }

  getReservationsByVenueIdAndDate(id: number, date: string): Observable<Reservation[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<Reservation[]>(`${this.ENDPOINT}/venue/${id}/date`, { params });
  }

  createReservation(reservation: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.ENDPOINT}`, reservation);
  }

  canceledReservation(id: number): Observable<string> {
    return this.http.put<string>(`${this.ENDPOINT}/${id}/canceled`, null);
  }

  getAvailableHours(venueId: number, fieldId: number, date: string): Observable<TimeSlot[]> {
    const params = new HttpParams()
      .set('venueId', venueId.toString())
      .set('fieldId', fieldId.toString())
      .set('date', date);
    return this.http.get<TimeSlot[]>(`${this.ENDPOINT}/availability/hours`, { params });
  }
}
