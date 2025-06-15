import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { User, UserAdmin } from "../../../../core/interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private url = environment.apiUrlLocal + '/person';

  constructor(private http: HttpClient) {}

  getAdminById(id: number | undefined): Observable<UserAdmin> {
    return this.http.get<UserAdmin>(`${this.url}/admin/${id}`);
  }

  getAdminByEmail(email: string): Observable<UserAdmin> {
    return this.http.get<UserAdmin>(`${this.url}/admin/by-email`, {
      params: { email }
    });
  }
}