export interface User {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  cellphone: string;
  email: string;
  imageUrl: string;
  role: UserRole;
}

export enum UserRole {
  PLAYER = 'PLAYER',
  FIELD_ADMIN = 'FIELD_ADMIN',
}
