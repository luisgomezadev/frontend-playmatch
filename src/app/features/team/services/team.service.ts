import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Team } from "../interfaces/team";

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private url = environment.apiUrlLocal + '/team';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<any> {
    return this.http.get(`${this.url}`);
  }

  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.url}/${id}`);
  }

  createTeam(team: any): Observable<any> {
    return this.http.post(`${this.url}`, team);
  }

  updateTeam(team: any): Observable<any> {
    return this.http.put(`${this.url}`, team);
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  addMemberToTeam(teamId: number, playerId: number): Observable<any> {
    return this.http.post(`${this.url}/${teamId}/member/${playerId}`, null)
  }

  deletePlayerOfTeam(teamId: number, playerId: number): Observable<any> {
    return this.http.post(`${this.url}/delete/${playerId}/team/${teamId}`, null)
  }
}