import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { LoadingFullComponent } from '../../shared/components/loading/loading-full/loading-full.component';
import { LINKS_DASHBOARD } from '../../shared/constants/links.constants';
import { User, UserRole } from '../user/interfaces/user';
import { UserService } from '../user/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, LoadingFullComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userActive!: User;
  sidebarOpen = false;
  loading = true;
  links: any[] = [];

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    const claims = this.authService.getClaimsFromToken();
    if (claims) {
      const email = claims.sub;
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
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed) {
        this.authService.logout();
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          icon: 'success',
          customClass: { confirmButton: 'swal-confirm-btn' },
          buttonsStyling: false
        });
      }
    });
  }
}
