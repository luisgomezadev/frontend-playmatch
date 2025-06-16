import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['luis@gmail.com', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['ADMIN', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.redirectIfAuthenticated();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password, role } = this.loginForm.value;

    const handleError = (err: any) => {
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: err?.error?.errorMessage || 'Falló la autenticación',
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'swal-confirm-btn' },
        buttonsStyling: false,
      });
    };

    const handleSuccess = () => {
      this.loading = false;
      this.router.navigate(['/dashboard/home-' + role.toLowerCase()]);
    };

    let loginObservable;

    switch (role) {
      case 'ADMIN':
        loginObservable = this.authService.loginAdmin(email, password);
        break;
      case 'PLAYER':
        loginObservable = this.authService.loginPlayer(email, password);
        break;
      default:
        this.loading = false;
        Swal.fire({
          icon: 'warning',
          title: 'Rol no válido',
          text: 'Selecciona un tipo de usuario válido.',
          confirmButtonText: 'Aceptar',
        });
        return;
    }

    loginObservable.subscribe({
      next: handleSuccess,
      error: handleError,
    });
  }
}
