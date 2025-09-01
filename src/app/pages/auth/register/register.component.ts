import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ErrorResponse } from '@core/interfaces/error-response';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { AsideAuthComponent } from '@shared/components/aside-auth/aside-auth.component';
import { ButtonActionComponent } from '@shared/components/button-action/button-action.component';
import { REGEX_PATTERNS } from '@shared/utils/regex-utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, AsideAuthComponent, ButtonActionComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);

  registerForm: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  roles: { value: string; label: string }[] = [
    { value: 'PLAYER', label: 'Jugador' },
    { value: 'FIELD_ADMIN', label: 'Administrador de cancha' }
  ];

  constructor() {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        city: ['Cartagena', [Validators.required]],
        cellphone: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.cellphone)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(REGEX_PATTERNS.password)
          ]
        ],
        role: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.authService.redirectIfAuthenticated();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  passwordMatchValidator(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid || this.registerForm.hasError('passwordMismatch')) return;

    this.registerForm.removeControl('confirmPassword'); // Eliminar confirmPassword antes de enviar

    const formData = this.registerForm.value;

    this.loading = true;

    const handleError = (err: ErrorResponse) => {
      this.loading = false;
      this.alertService.error('Error al registrar', err?.error?.message || 'Falló el registro');
    };

    const handleSuccess = () => {
      this.loading = false;
      this.alertService.success('Registro exitoso', 'Ahora puedes iniciar sesión');
      this.router.navigate(['/login']);
    };

    const loginObservable = this.authService.registerUser(formData);

    loginObservable.subscribe({
      next: handleSuccess,
      error: handleError
    });
  }
}
