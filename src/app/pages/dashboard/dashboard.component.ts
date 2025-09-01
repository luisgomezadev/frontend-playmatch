import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Link } from '@core/interfaces/link.interface';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { LoadingFullComponent } from '@shared/components/loading/loading-full/loading-full.component';
import { LINKS_DASHBOARD } from '@shared/constants/links.constants';
import { User, UserRole } from '@user/interfaces/user';
import { UserService } from '@user/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, LoadingFullComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private alertService = inject(AlertService);

  userActive!: User;
  sidebarOpen = false;
  loading = true;
  links: Link[] = [];

  ngOnInit(): void {
    const claims = this.authService.getClaimsFromToken();
    if (claims) {
      const email = claims.sub;
      if (typeof email === 'string') {
        this.userService.getUserByEmail(email).subscribe({
          next: (user: User) => {
            this.loading = false;
            this.userActive = user;
            this.authService.setUser(user);
            this.loadLinks();
          },
          error: err => {
            this.loading = false;
            console.error('Error obteniendo usuario:', err);
          }
        });
      } else {
        this.loading = false;
        this.alertService.error('Error', 'No se pudo obtener el correo del usuario.')
        this.authService.logout();
      }
    } else {
      this.authService.logout();
      this.loading = false;
    }
  }

  loadLinks() {
    this.links = LINKS_DASHBOARD.filter(
      item => item.role === this.userActive?.role || item.role === 'all'
    );
  }

  getNameRole(): string {
    return this.userActive.role == UserRole.FIELD_ADMIN ? 'administrador' : 'jugador';
  }

  getImageUrl(user: User): string {
    return user.imageUrl?.startsWith('http') ? user.imageUrl : '/assets/profile_icon.webp';
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  logout(): void {
    this.alertService
      .confirm('¿Cerrar sesión?', '¿Estás seguro de que deseas cerrar sesión?')
      .then(confirmed => {
        if (confirmed) {
          this.authService.logout();
          this.alertService.success('Sesión cerrada', 'Has cerrado sesión correctamente.');
        }
      });
  }
}
