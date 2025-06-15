import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { filter } from 'rxjs';
import { FooterComponent } from "./shared/components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  showNavbar = true;
  showFooter = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEndEvent = event as NavigationEnd;
      this.showNavbar = !navEndEvent.urlAfterRedirects.startsWith('/dashboard');
      this.showFooter = !(
        navEndEvent.urlAfterRedirects.startsWith('/login') ||
        navEndEvent.urlAfterRedirects.startsWith('/register') ||
        navEndEvent.urlAfterRedirects.startsWith('/dashboard')
      );
    });
  }
  
}
