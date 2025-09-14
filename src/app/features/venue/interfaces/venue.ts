import { Field } from "@features/field/interfaces/field";
import { User } from "@features/user/interfaces/user";

export interface Venue {
  id: number;
  code: string;
  name: string;
  city: string;
  address: string;
  openingHour: string;
  closingHour: string;
  admin?: User;
  status: Status;
  fields: Field[]
}

export interface VenueRequest {
  id: number;
  name: string;
  city: string;
  address: string;
  openingHour: string;
  closingHour: string;
  admin?: User;
  status: Status;
  fields: Field[]
}

export interface VenueFilter {
  name?: string;
  city?: string;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
