import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFields(): Observable<any> {
    return this.http.get(`${this.url}/field`);
  }

  getFieldById(id: number): Observable<any> {
    return this.http.get(`${this.url}/field/${id}`);
  }

  createField(field: any): Observable<any> {
    return this.http.post(`${this.url}/field`, field);
  }

  updateField(id: number, field: any): Observable<any> {
    return this.http.put(`${this.url}/field/${id}`, field);
  }

  deleteField(id: number): Observable<any> {
    return this.http.delete(`${this.url}/field/${id}`);
  }

}