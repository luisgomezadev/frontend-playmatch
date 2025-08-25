import { User } from "../../user/interfaces/user";
import { Field } from "../../field/interfaces/field";

export interface Reservation {
  id: number;
  user: User;
  field: Field;
  hours: number;
  startTime: string;
  endTime: string;
  reservationDate: string;
  status: StatusReservation;
}

export interface ConfirmedReservation {
  user?: User;
  field?: Field;
  hours: number;
  startTime: string;
  endTime: string;
  reservationDate: string;
}

export interface ReservationFilter {
  fieldId?: number;
  userId?: number;
  status?: StatusReservation;
  date?: string;
}

export enum StatusReservation {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  FINISHED = 'FINISHED'
}
