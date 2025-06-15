import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Field } from "../interfaces/field";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  private url = environment.apiUrlLocal;

  constructor(private http: HttpClient) {}

  getFields(): Observable<any> {
    return this.http.get(`${this.url}/field`);
  }

  getFieldById(id: number): Observable<Field> {
    return this.http.get<Field>(`${this.url}/field/${id}`);
  }

  getFieldsByAdminId(adminId: number): Observable<any> {
    return this.http.get(`${this.url}/field/admin/${adminId}`);
  }

  createField(field: any): Observable<any> {
    return this.http.post(`${this.url}/field`, field);
  }

  updateField(field: any): Observable<any> {
    return this.http.put(`${this.url}/field`, field);
  }

  deleteField(id: number): Observable<any> {
    return this.http.delete(`${this.url}/field/${id}`);
  }

}