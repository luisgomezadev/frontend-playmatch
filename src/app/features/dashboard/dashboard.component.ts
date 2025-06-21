import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AdminService } from './admin/services/admin.service';
import { Field } from '../field/interfaces/field';
import { User, UserAdmin, UserPlayer } from '../../core/interfaces/user';
import { LINKS_DASHBOARD } from '../../shared/constants/links.constants';
import { PlayerService } from './player/services/player.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  userActive: User | null = null;
  sidebarOpen = false;
  userRole: string | undefined = '';
  field: Field | null = null;
  loading = true;
  links: any[] = [];

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    const claims = this.authService.getClaimsFromToken();
    console.log(claims);
    if (claims) {
      const email = claims.sub;
      const role = claims.role;
      if (role === 'ADMIN') {
        this.adminService.getAdminByEmail(email).subscribe({
          next: (admin: UserAdmin) => {
            this.loading = false;
            this.userActive = { ...admin, role: 'ADMIN' };
            this.authService.setUser(admin);
            this.loadLinks();
          },
          error: (err) => {
            this.loading = false;
            console.error('Error obteniendo admin:', err);
          },
        });
      }

      if (role === 'PLAYER') {
        this.playerService.getPlayerByEmail(email).subscribe({
          next: (player: UserPlayer) => {
            this.loading = false;
            this.userActive = { ...player, role: 'PLAYER' };
            this.authService.setUser(player);
            this.loadLinks();
          },
          error: (err) => {
            this.loading = false;
            console.error('Error obteniendo admin:', err);
          },
        });
      }
    } else {
      this.authService.logout();
      this.loading = false;
    }
  }

  loadLinks() {
    this.links = LINKS_DASHBOARD.filter(
      (item) => item.role === this.userActive?.role || item.role === 'all'
    );
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
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          icon: 'success',
          customClass: { confirmButton: 'swal-confirm-btn' },
          buttonsStyling: false,
        });
      }
    });
  }
}
