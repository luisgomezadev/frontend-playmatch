import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Team } from "../interfaces/team";

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private url = environment.apiUrlLocal;

  constructor(private http: HttpClient) {}

  getTeams(): Observable<any> {
    return this.http.get(`${this.url}/team`);
  }

  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.url}/team/${id}`);
  }

  createTeam(team: any): Observable<any> {
    return this.http.post(`${this.url}/team`, team);
  }

  updateTeam(team: any): Observable<any> {
    return this.http.put(`${this.url}/team`, team);
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete(`${this.url}/team/${id}`);
  }

}