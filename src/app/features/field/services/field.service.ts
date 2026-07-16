import { Injectable } from '@angular/core';
import { Field, FieldRequest } from '@field/interfaces/field';
import { BaseHttpService } from '@shared/data-access/base-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldService extends BaseHttpService {
  private readonly ENDPOINT = this.apiUrl + '/field';

  getFieldById(id: number): Observable<Field> {
    return this.http.get<Field>(`${this.ENDPOINT}/${id}`);
  }

  getFieldsByVenueId(venueId: number): Observable<Field[]> {
    return this.http.get<Field[]>(`${this.ENDPOINT}/venue/${venueId}`);
  }

  getAllFieldsByVenueId(venueId: number): Observable<Field[]> {
    return this.http.get<Field[]>(`${this.ENDPOINT}/all/venue/${venueId}`);
  }

  createField(field: FieldRequest): Observable<Field> {
    return this.http.post<Field>(`${this.ENDPOINT}`, field);
  }

  updateField(field: FieldRequest, fieldId: number): Observable<Field> {
    return this.http.put<Field>(`${this.ENDPOINT}/${fieldId}`, field);
  }

  deactivateById(id: number): Observable<void> {
    return this.http.patch<void>(`${this.ENDPOINT}/${id}/deactivate`, {});
  }

  activateById(id: number): Observable<void> {
    return this.http.patch<void>(`${this.ENDPOINT}/${id}/activate`, {});
  }
}
