import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly router = inject(Router);

  isScrolled = false;

  menuOpen = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20; // cambia a true si bajamos más de 20px
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  goToPage(page: string): void {
    this.menuOpen = false;
    this.router.navigate([page]);
  }
}
