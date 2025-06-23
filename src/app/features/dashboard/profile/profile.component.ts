import { Component } from '@angular/core';
import { User, UserAdmin, UserPlayer } from '../../../core/interfaces/user';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user!: UserPlayer | UserAdmin;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  public isUserAdmin(user: any): user is UserAdmin {
    return 'field' in user;
  }

  public isUserPlayer(user: any): user is UserPlayer {
    return 'team' in user;
  }
}
