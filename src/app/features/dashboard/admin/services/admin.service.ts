import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { User, UserAdmin } from '../../../../core/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private url = environment.apiUrl + '/user/admin';

  constructor(private http: HttpClient) {}

  getAdminById(id: number | undefined): Observable<UserAdmin> {
    return this.http.get<UserAdmin>(`${this.url}/${id}`);
  }

  getAdminByEmail(email: string): Observable<UserAdmin> {
    return this.http.get<UserAdmin>(`${this.url}/by-email`, {
      params: { email },
    });
  }

  updateAdmin(admin: User): Observable<any> {
    return this.http.put(`${this.url}`, admin);
  }

  uploadUserImage(userId: number, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<User>(`${this.url}/${userId}/upload-image`, formData);
  }
}
