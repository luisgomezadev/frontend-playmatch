import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { UserPlayer } from "../../../../core/interfaces/user";
import { List } from "postcss/lib/list";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private url = environment.apiUrlLocal + '/person';

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<UserPlayer[]> {
    return this.http.get<UserPlayer[]>(`${this.url}/player`);
  }

  getPlayerById(id: number | undefined): Observable<UserPlayer> {
    return this.http.get<UserPlayer>(`${this.url}/player/${id}`);
  }

  getPlayerByEmail(email: string): Observable<UserPlayer> {
    return this.http.get<UserPlayer>(`${this.url}/player/by-email`, {
      params: { email }
    });
  }
}