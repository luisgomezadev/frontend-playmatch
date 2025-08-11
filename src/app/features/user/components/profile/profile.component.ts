import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { User, UserRole } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ButtonActionComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {

  private authService = inject(AuthService);
  private userService = inject(UserService);

  user!: User;
  loading = false;

  showImageModal = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor() { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  public isUserAdmin(user: User): boolean {
    return user.role == UserRole.FIELD_ADMIN;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result);
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onCancelImageUpload() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.showImageModal = false;
  }

  onUploadImage() {
    if (!this.selectedFile) return;

    const file = this.selectedFile;

    if (!file.type.startsWith('image/')) {
      this.showErrorAlert(
        'Formato no válido',
        'Por favor, selecciona un archivo de imagen.'
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.showErrorAlert(
        'Tamaño de archivo demasiado grande',
        'El archivo debe ser menor a 2MB.'
      );
      return;
    }
    this.loading = true;

    const uploadObservable = this.userService.uploadUserImage(this.user.id, file);

    uploadObservable.subscribe({
      next: (updatedUser) => this.handleSuccess(updatedUser),
      error: (err) => {
        this.showErrorAlert('Error al subir la imagen', err.message);
        this.loading = false;
      },
    });
  }

  private handleSuccess(updatedUser: User) {
    // Actualizar el observable del usuario actual
    this.authService.setUser(updatedUser);

    this.loading = false;
    Swal.fire({
      icon: 'success',
      title: 'Foto Actualizada',
      text: 'Tu imagen de perfil ha sido cambiada.',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
      buttonsStyling: false,
    });

    // Reset modal
    this.showImageModal = false;
    this.selectedFile = null;
    this.imagePreview = null;

    // Asignar nuevo usuario localmente
    this.user = updatedUser;
  }

  private showErrorAlert(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
      buttonsStyling: false,
    });
  }

  getImageUrl(user: User): string {
    return user.imageUrl?.startsWith('http')
      ? user.imageUrl
      : '/assets/profile_icon.webp';
  }
}
