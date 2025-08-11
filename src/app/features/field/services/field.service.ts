import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Field } from '../interfaces/field';
import { BaseHttpService } from '../../../shared/data-access/base-http.service';

@Injectable({
  providedIn: 'root'
})
export class FieldService extends BaseHttpService {
  private url = this.apiUrl + '/field';

  getFields(): Observable<any> {
    return this.http.get(`${this.url}`);
  }

  getFieldsActive(): Observable<any> {
    return this.http.get(`${this.url}/active`);
  }

  getFieldById(id: number): Observable<Field> {
    return this.http.get<Field>(`${this.url}/${id}`);
  }

  getFieldByAdminId(adminId: number): Observable<any> {
    return this.http.get(`${this.url}/admin/${adminId}`);
  }

  createField(field: any): Observable<any> {
    return this.http.post(`${this.url}`, field);
  }

  updateField(field: any): Observable<any> {
    return this.http.put(`${this.url}`, field);
  }

  deleteField(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
