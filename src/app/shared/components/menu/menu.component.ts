import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LINKS_DASHBOARD } from '../../constants/links.constants';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { UserAdmin, UserPlayer } from '../../../core/interfaces/user';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  role: string = '';
  links: any[] = [];
  userActive: any;

  constructor(private authService: AuthService, private router: Router) {
    const claims = this.authService.getClaimsFromToken();
    if (claims) {
      this.role = claims.role;
    }

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userActive = user;
        this.loadLinks();
      }
    });
  }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize(): void {
    const link = this.role === 'FIELD_ADMIN' ? 'admin' : 'player';
    if (window.innerWidth > 768)
      this.router.navigate(['/dashboard/home-' + link]);
  }

  loadLinks() {
    this.links = LINKS_DASHBOARD.filter(
      (item) =>
        item.role === this.role || (item.role === 'all' && item.viewDesktop)
    );

    if (this.role === 'PLAYER' && (this.userActive?.team == null)) {
      this.links = this.links.filter((item) => item.requiredTeam !== true);
    }
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
