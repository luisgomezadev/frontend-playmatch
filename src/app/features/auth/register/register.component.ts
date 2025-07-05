import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { NEIGHBORHOODS } from '../../../shared/constants/neighborhoods.constants';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#()_\-^+=])[A-Za-z\d@$!%*?&#()_\-^+=]{8,}$/;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgSelectModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        city: ['Cartagena', [Validators.required]],
        age: ['', [Validators.required]],
        cellphone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        documentType: ['CC', [Validators.required]],
        documentNumber: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(passwordPattern),
          ],
        ],
        role: ['', Validators.required],
        confirmPassword: ['', Validators.required],
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

  onSubmit() {
    if (
      this.registerForm.invalid ||
      this.registerForm.hasError('passwordMismatch')
    )
      return;

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
        buttonsStyling: false,
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
          confirmButton: 'swal-confirm-btn',
        },
        buttonsStyling: false,
      });
      this.router.navigate(['/login']);
    };

    let loginObservable;

    switch (this.registerForm.value.role) {
      case 'FIELD_ADMIN':
        const { role: adminRole, ...adminData } = formData;
        loginObservable = this.authService.registerAdmin(adminData);
        break;
      case 'PLAYER':
        const { role: playerRole, ...playerData } = formData;
        loginObservable = this.authService.registerPlayer(playerData);
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
