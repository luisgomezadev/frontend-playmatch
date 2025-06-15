import { Component } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { User } from '../../../../../core/interfaces/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-player',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-player.component.html',
  styleUrl: './home-player.component.scss'
})
export class HomePlayerComponent {

  user!: User;
  fullName: string = '';
  
  constructor(private authService: AuthService){
  
  }
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.fullName = `${this.user.firstName} ${this.user.lastName}`;
      }
    });
  }

}
