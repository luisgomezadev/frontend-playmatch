import { User } from "@user/interfaces/user";
import { Field } from "@field/interfaces/field";

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

export interface ReservationRequest {
  reservationDate: string;
  startTime: string;
  hours: number;
  userId?: number;
  fieldId?: number;
}

export interface ReservationFilter {
  fieldId?: number;
  userId?: number;
  status?: StatusReservation;
  date?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export enum StatusReservation {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  FINISHED = 'FINISHED'
}
