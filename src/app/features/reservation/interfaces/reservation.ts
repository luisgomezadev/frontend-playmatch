import { Field } from "../../field/interfaces/field";
import { Team } from "../../team/interfaces/team";

export interface Reservation {
  id: number;
  team?: Team;
  field?: Field;
  hours: number;
  startTime: string;
  endTime: string;
  reservationDate: string;
  status: StatusReservation;
}

export interface ConfirmedReservation {
  team?: Team;
  field?: Field;
  hours: number;
  startTime: string;
  endTime: string;
  reservationDate: string;
}

export enum StatusReservation {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  FINISHED = 'FINISHED'
}
