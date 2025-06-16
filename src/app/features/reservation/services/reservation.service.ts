import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ConfirmedReservation, Reservation } from '../interfaces/reservation';

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
    return this.http.post(`${this.url}/finalize/${id}`, null);
  }

  canceledReservationById(id: number): Observable<any> {
    return this.http.post(`${this.url}/canceled/${id}`, null);
  }

  getCountActiveByTeam(teamId: number): Observable<any> {
    return this.http.get(`${this.url}/team/${teamId}/active`);
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

  getReservationAvailability(
    reservation: any
  ): Observable<ConfirmedReservation> {
    return this.http.post<ConfirmedReservation>(
      `${this.url}/availability`,
      reservation
    );
  }
}
