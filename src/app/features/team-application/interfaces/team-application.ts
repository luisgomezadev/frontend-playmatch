import { User } from "../../../core/interfaces/user";
import { Team } from "../../team/interfaces/team";

export interface TeamApplication {
  id: number;
  description: string;
  player: User;
  team: Team;
  applicationDate: string;
  statusRequest: StatusRequest;
}

export interface TeamApplicationRequest {
  playerId: number;
  teamId: number;
  description: string;
}

export enum StatusRequest {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING'
}