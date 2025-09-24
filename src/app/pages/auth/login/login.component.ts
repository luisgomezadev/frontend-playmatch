import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ErrorResponse } from '@core/interfaces/error-response';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { LoadingTextComponent } from '@shared/components/loading-text/loading-text.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
    LoadingTextComponent,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password } = this.loginForm.value;

    const handleError = (err: ErrorResponse) => {
      this.loading = false;
      this.alertService.error(
        'Error al iniciar sesión',
        err?.error?.message || 'Falló la autenticación'
      );
    };

    const handleSuccess = () => {
      this.loading = false;
      this.authService.redirectIfAuthenticated();
    };

    const loginObservable = this.authService.loginUser(email, password);

    loginObservable.subscribe({
      next: handleSuccess,
      error: handleError
    });
  }
}
