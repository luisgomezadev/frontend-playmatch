import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LINKS_DASHBOARD } from '../../constants/links.constants';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../features/user/interfaces/user';
import { Link } from '../../../core/interfaces/link.interface';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {

  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  role = '';
  links: Link[] = [];
  userActive: User | null = null;

  constructor() {
    const claims = this.authService.getClaimsFromToken();
    if (claims) {
      this.role = claims.role ?? '';
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
    if (window.innerWidth > 768){
      if (this.role === 'FIELD_ADMIN') {
        this.router.navigate(['/dashboard/home-admin']);
      } else {
        this.router.navigate(['/dashboard/field/list']);
      }
    }
  }

  loadLinks() {
    this.links = LINKS_DASHBOARD.filter(
      (item) =>
        item.role === this.role || (item.role === 'all' && item.viewDesktop)
    );
  }

  logout(): void {
    this.alertService
      .confirm('¿Cerrar sesión?', '¿Estás seguro de que deseas cerrar sesión?', 'Sí, salir')
      .then(confirmed => {
        if (confirmed) {
          this.authService.logout();
          this.alertService.success('Sesión cerrada', 'Has cerrado sesión correctamente.');
        }
      });
  }
}
