import { UserPlayer } from '../../../core/interfaces/user';
import { Reservation } from '../../reservation/interfaces/reservation';

export interface Team {
  id: number;
  name: string;
  neighborhood: string;
  city: string;
  maxPlayers: number;
  ownerId: number;
  members: UserPlayer[];
  imageUrl: string;
  reservations: Reservation[];
}
