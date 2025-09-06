import { Reservation } from "@reservation/interfaces/reservation";
import { User } from "@user/interfaces/user";

export interface Field {
  id: number;
  name: string;
  address: string;
  city: string;
  hourlyRate: number;
  openingHour: string;
  closingHour: string;
  status: Status;
  admin?: User;
  imageUrl: string;
  reservations: Reservation[]
}

export interface FieldRequest {
  id: number;
  name: string;
  address: string;
  city: string;
  hourlyRate: number;
  openingHour: string;
  closingHour: string;
  status: Status;
  adminId: number;
  imageUrl: string;
}

export interface FieldFilter {
  name?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
