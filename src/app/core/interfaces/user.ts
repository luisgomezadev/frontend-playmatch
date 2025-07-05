import { Field } from '../../features/field/interfaces/field';
import { Team } from '../../features/team/interfaces/team';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  age: number;
  cellphone: string;
  documentType: string;
  documentNumber: string;
  email: string;
  imageUrl: string;
  role: 'PLAYER' | 'FIELD_ADMIN';
}

// Interfaz que extiende User y agrega la propiedad 'field'
export interface UserAdmin extends User {
  field?: Field | null;
}

// Interfaz que extiende User y agrega la propiedad 'team'
export interface UserPlayer extends User {
  team?: Team | null;
}
