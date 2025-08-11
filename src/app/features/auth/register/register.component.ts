import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { AsideAuthComponent } from '../../../shared/components/aside-auth/aside-auth.component';
import { REGEX_PATTERNS } from '../../../shared/utils/regex-utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgSelectModule, AsideAuthComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  registerForm: FormGroup;
  loading = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

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

    const { confirmPassword, ...formData } = this.registerForm.value;

    this.loading = true;

    const handleError = (err: any) => {
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: err?.error?.message || 'Falló el registro',
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'swal-confirm-btn' },
        buttonsStyling: false
      });
    };

    const handleSuccess = () => {
      this.loading = false;
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'swal-confirm-btn'
        },
        buttonsStyling: false
      });
      this.router.navigate(['/login']);
    };

    let loginObservable = this.authService.registerUser(formData);

    loginObservable.subscribe({
      next: handleSuccess,
      error: handleError
    });
  }
}
