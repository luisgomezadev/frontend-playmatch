import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ErrorResponse } from '@core/interfaces/error-response';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { AsideAuthComponent } from '@shared/components/aside-auth/aside-auth.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, AsideAuthComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.redirectIfAuthenticated();
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
