import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { PopupComponent } from '@shared/components/popup/popup.component';
import { Router } from "@angular/router";
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, PopupComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly router = inject(Router);

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToRegister(): void {
    this.router.navigate(['/registro']);
  }

  goToReservationDetail(): void {
    this.router.navigate(['/reserva']);
  }

}
