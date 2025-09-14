import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoadingBarComponent } from '@shared/components/loading-bar/loading-bar.component';
import { NavbarComponent } from "@shared/components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingBarComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private router = inject(Router);

  showNavbar = true;

  constructor() {
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url.split('?')[0];
      this.showNavbar = !currentUrl.startsWith('/dashboard');
    });
  }
}
