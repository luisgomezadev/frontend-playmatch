import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResponse } from '../interfaces/paged-response';
import { User, UserRole } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = environment.apiUrl + '/user';

  constructor(private http: HttpClient) {}

  getUsers(page: number, size: number, role: UserRole): Observable<PagedResponse<User>> {
    const params = new HttpParams().set('page', page).set('size', size).set('role', role);
    return this.http.get<PagedResponse<User>>(this.url, { params });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.url}/by-email`, {
      params: { email },
    });
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.url}`, user);
  }

  uploadUserImage(userId: number, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<User>(`${this.url}/${userId}/upload-image`, formData);
  }
}
