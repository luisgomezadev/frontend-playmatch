import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResponse } from '@core/interfaces/paged-response';
import { Field, FieldFilter, FieldRequest } from '@field/interfaces/field';
import { BaseHttpService } from '@shared/data-access/base-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldService extends BaseHttpService {
  private readonly ENDPOINT = this.apiUrl + '/field';

  getFields(filters: FieldFilter, page: number, size: number): Observable<PagedResponse<Field>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.city) {
      params = params.set('city', filters.city);
    }
    if (filters.minPrice) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    return this.http.get<PagedResponse<Field>>(`${this.ENDPOINT}`, { params });
  }

  getFieldsActive(): Observable<Field[]> {
    return this.http.get<Field[]>(`${this.ENDPOINT}/active`);
  }

  getFieldById(id: number): Observable<Field> {
    return this.http.get<Field>(`${this.ENDPOINT}/${id}`);
  }

  getFieldByAdminId(adminId: number): Observable<Field> {
    return this.http.get<Field>(`${this.ENDPOINT}/admin/${adminId}`);
  }

  createField(field: FieldRequest): Observable<Field> {
    return this.http.post<Field>(`${this.ENDPOINT}`, field);
  }

  updateField(field: FieldRequest): Observable<Field> {
    return this.http.put<Field>(`${this.ENDPOINT}`, field);
  }

  deleteField(id: number): Observable<string> {
    return this.http.delete<string>(`${this.ENDPOINT}/${id}`);
  }
}
