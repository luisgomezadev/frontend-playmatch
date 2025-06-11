import { Time } from "@angular/common";
import { Admin } from "./admin";

export interface Field {
  id: number;
  name: string;
  address: string;
  city: string;
  description: string;
  hourlyRate: number;
  openingHour: Time;
  closingHour: Time;
  status: string;
  admin: Admin;
}