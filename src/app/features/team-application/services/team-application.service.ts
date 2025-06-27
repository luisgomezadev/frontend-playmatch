import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { StatusRequest, TeamApplication, TeamApplicationRequest } from '../interfaces/team-application';

@Injectable({
  providedIn: 'root'
})
export class TeamApplicationService {

  private url = environment.apiUrl + '/request';

  constructor(private http: HttpClient) { }


  /**
   * Enviar solicitud de unión a equipo
   */
  sendTeamApplication(request: TeamApplicationRequest): Observable<TeamApplication> {
    return this.http.post<TeamApplication>(`${this.url}`, request);
  }

  /**
   * Obtener solicitudes de un jugador
   */
  getTeamApplicationsByPlayer(playerId: number): Observable<TeamApplication[]> {
    return this.http.get<TeamApplication[]>(`${this.url}/player/${playerId}`);
  }

  /**
   * Obtener solicitudes de un equipo
   */
  getTeamApplicationsByTeam(teamId: number): Observable<TeamApplication[]> {
    return this.http.get<TeamApplication[]>(`${this.url}/team/${teamId}`);
  }

  /**
   * Aceptar o rechazar solicitud
   */
  handleTeamApplication(id: number, statusRequest: StatusRequest): Observable<any> {
    const params = new HttpParams().set('statusRequest', statusRequest);
    return this.http.post(`${this.url}/${id}`, null, { params });
  }
}
