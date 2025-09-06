export interface User {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  city: string;
  cellphone: string;
  email: string;
  imageUrl: string;
  role: UserRole;
}

export interface UserFilter {
  name?: string;
  city?: string;
}

export enum UserRole {
  PLAYER = 'PLAYER',
  FIELD_ADMIN = 'FIELD_ADMIN',
}
