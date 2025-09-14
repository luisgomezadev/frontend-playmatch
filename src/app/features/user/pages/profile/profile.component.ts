import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { User, UserRole } from '@user/interfaces/user';
import { UserService } from '@user/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ButtonComponent, ModalComponent, LayoutComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  user!: User;
  loading = false;
  userRole = UserRole;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  isOpen = signal(false);

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  openModal() {
    document.body.style.overflow = 'hidden';
    this.isOpen.set(true);
  }

  onClosed() {
    // reset de estado
    this.selectedFile = null;
    this.imagePreview = null;

    // limpia el input file de forma segura
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    } else {
      // fallback por si el ViewChild no está disponible (p. ej. proyección/dom removido)
      const el = document.getElementById('profile-file-input') as HTMLInputElement | null;
      if (el) el.value = '';
    }

    document.body.style.overflow = '';
    this.isOpen.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onUploadImage() {
    if (!this.selectedFile) return;
    const file = this.selectedFile;

    if (!file.type.startsWith('image/')) {
      this.alertService.error('Error', 'Por favor, selecciona un archivo de imagen.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.alertService.error('Error', 'El archivo debe ser menor a 2MB.');
      return;
    }
    this.loading = true;

    this.userService.uploadUserImage(this.user.id, file).subscribe({
      next: (updatedUser) => this.handleSuccess(updatedUser),
      error: (err) => {
        this.alertService.error('Error', err.error?.message || 'Error al subir la imagen');
        this.loading = false;
      },
    });
  }

  private handleSuccess(updatedUser: User) {
    this.authService.setUser(updatedUser);
    this.loading = false;
    this.alertService.success('Foto Actualizada', 'Tu imagen de perfil ha sido cambiada.');

    // reset y cerrar modal
    this.onClosed();

    this.user = updatedUser;
  }

  getImageUrl(user: User): string {
    return user.imageUrl?.startsWith('http') ? user.imageUrl : '/assets/profile_icon.webp';
  }

  logout(): void {
    this.alertService
      .confirm('¿Cerrar sesión?', '¿Estás seguro de que deseas cerrar sesión?')
      .then(confirmed => {
        if (confirmed) {
          this.authService.logout();
          this.alertService.success('Sesión cerrada', 'Has cerrado sesión correctamente.');
        }
      });
  }
}
