import { Injectable } from '@angular/core';
import { PagedResponse } from '@core/interfaces/paged-response';
import { Field, FieldRequest } from '@field/interfaces/field';
import { BaseHttpService } from '@shared/data-access/base-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldService extends BaseHttpService {
  private readonly url = this.apiUrl + '/field';

  getFields(): Observable<PagedResponse<Field>> {
    return this.http.get<PagedResponse<Field>>(`${this.url}`);
  }

  getFieldsActive(): Observable<Field[]> {
    return this.http.get<Field[]>(`${this.url}/active`);
  }

  getFieldById(id: number): Observable<Field> {
    return this.http.get<Field>(`${this.url}/${id}`);
  }

  getFieldByAdminId(adminId: number): Observable<Field> {
    return this.http.get<Field>(`${this.url}/admin/${adminId}`);
  }

  createField(field: FieldRequest): Observable<Field> {
    return this.http.post<Field>(`${this.url}`, field);
  }

  updateField(field: FieldRequest): Observable<Field> {
    return this.http.put<Field>(`${this.url}`, field);
  }

  deleteField(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
