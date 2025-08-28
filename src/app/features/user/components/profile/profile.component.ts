import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { ButtonActionComponent } from '@shared/components/button-action/button-action.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { User, UserRole } from '@user/interfaces/user';
import { UserService } from '@user/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ButtonActionComponent, ModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private alertService = inject(AlertService);

  user!: User;
  loading = false;

  showImageModal = false;
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
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  onClosed() {
    this.isOpen.set(false);
    this.selectedFile = null;
    this.imagePreview = null;
    document.body.style.overflow = '';
  }

  public isUserAdmin(user: User): boolean {
    return user.role == UserRole.FIELD_ADMIN;
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

  // onCancelImageUpload() {
  //   this.selectedFile = null;
  //   this.imagePreview = null;
  //   this.showImageModal = false;
  // }

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

    const uploadObservable = this.userService.uploadUserImage(this.user.id, file);

    uploadObservable.subscribe({
      next: (updatedUser) => this.handleSuccess(updatedUser),
      error: (err) => {
        this.alertService.error('Error', err.error?.message || 'Error al subir la imagen');
        this.loading = false;
      },
    });
  }

  private handleSuccess(updatedUser: User) {

    // Actualizar el observable del usuario actual
    this.authService.setUser(updatedUser);

    this.loading = false;
    this.alertService.success('Foto Actualizada', 'Tu imagen de perfil ha sido cambiada.');

    // Resetear modal
    this.showImageModal = false;
    this.selectedFile = null;
    this.imagePreview = null;

    // Asignar nuevo usuario localmente
    this.user = updatedUser;
  }

  getImageUrl(user: User): string {
    return user.imageUrl?.startsWith('http')
      ? user.imageUrl
      : '/assets/profile_icon.webp';
  }
}
