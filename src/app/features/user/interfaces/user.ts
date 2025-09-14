export interface User {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
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
  USER = 'USER'
}
