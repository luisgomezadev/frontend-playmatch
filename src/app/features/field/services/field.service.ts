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

  createField(field: FieldRequest): Observable<Field> {
    return this.http.post<Field>(`${this.ENDPOINT}`, field);
  }

  deleteFieldById(id: number): Observable<string> {
    return this.http.delete<string>(`${this.ENDPOINT}/${id}`);
  }
}
