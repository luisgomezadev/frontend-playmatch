export interface Venue {
  id: number;
  code: string;
  name: string;
  city: string;
  address: string;
  openingHour: string;
  closingHour: string;
  adminId?: number;
}

export interface VenueRequest {
  code: string;
  name: string;
  city: string;
  address: string;
  openingHour: string;
  closingHour: string;
  adminId: number;
}

export interface VenueFilter {
  name?: string;
  city?: string;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
