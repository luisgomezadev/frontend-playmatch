import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';
import { AsideAuthComponent } from '../../../shared/components/aside-auth/aside-auth.component';
import { ErrorResponse } from '../../../core/interfaces/error-response';

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
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: err?.error?.message || 'Falló la autenticación',
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'swal-confirm-btn' },
        buttonsStyling: false
      });
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
