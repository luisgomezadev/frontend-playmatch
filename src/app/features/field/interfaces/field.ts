import { Reservation } from "../../reservation/interfaces/reservation";
import { User } from "../../../core/interfaces/user";

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

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
