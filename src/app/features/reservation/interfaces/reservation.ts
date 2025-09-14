export interface Reservation {
  id: number;
  code: string;
  user: string;
  cellphone: string;
  fieldId: number;
  fieldName: string;
  venueId: number;
  venueName: string;
  duration: ReservationDuration;
  startTime: string;
  endTime: string;
  reservationDate: string;
  status: Status;
}

export interface ReservationRequest {
  user: string;
  cellphone: string;
  fieldId: number;
  duration: ReservationDuration;
  startTime: string;
  reservationDate: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum ReservationDuration {
  MIN_60 = 'MIN_60',
  MIN_90 = 'MIN_90',
  MIN_120 = 'MIN_120'
}
