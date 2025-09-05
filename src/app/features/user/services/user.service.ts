import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserRole } from '@user/interfaces/user';
import { PagedResponse } from '@core/interfaces/paged-response';
import { BaseHttpService } from '@shared/data-access/base-http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseHttpService {
  private readonly ENDPOINT = this.apiUrl + '/user';

  getUsers(page: number, size: number, role: UserRole): Observable<PagedResponse<User>> {
    const params = new HttpParams().set('page', page).set('size', size).set('role', role);
    return this.http.get<PagedResponse<User>>(this.ENDPOINT, { params });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.ENDPOINT}/${id}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.ENDPOINT}/by-email`, {
      params: { email },
    });
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.ENDPOINT}`, user);
  }

  uploadUserImage(userId: number, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<User>(`${this.ENDPOINT}/${userId}/upload-image`, formData);
  }
}
