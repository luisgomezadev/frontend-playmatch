import { Reservation } from '@reservation/interfaces/reservation';

export interface Field {
  id: number;
  name: string;
  fieldType: FieldType;
  hourlyRate: number;
  reservations: Reservation[];
}

export interface FieldRequest {
  id: number;
  name: string;
  fieldType: FieldType;
  hourlyRate: number;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum FieldType {
  FIVE_A_SIDE = 'FIVE_A_SIDE',
  SIX_A_SIDE = 'SIX_A_SIDE',
  SEVEN_A_SIDE = 'SEVEN_A_SIDE',
  EIGHT_A_SIDE = 'EIGHT_A_SIDE',
  NINE_A_SIDE = 'NINE_A_SIDE',
  ELEVEN_A_SIDE = 'ELEVEN_A_SIDE'
}
