import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Field } from '../interfaces/field';

@Injectable({
  providedIn: 'root',
})
export class FieldService {
  private url = environment.apiUrl + '/field';

  constructor(private http: HttpClient) {}

  getFields(): Observable<any> {
    return this.http.get(`${this.url}`);
  }

  getFieldsActive(): Observable<any> {
    return this.http.get(`${this.url}/active`);
  }

  getFieldById(id: number): Observable<Field> {
    return this.http.get<Field>(`${this.url}/${id}`);
  }

  getFieldsByAdminId(adminId: number): Observable<any> {
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
