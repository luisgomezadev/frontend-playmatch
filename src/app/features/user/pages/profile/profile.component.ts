import { Component, DestroyRef, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, switchMap } from 'rxjs';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { ErrorResponse } from '@core/interfaces/error-response';
import { FieldService } from '@features/field/services/field.service';
import { Venue } from '@features/venue/interfaces/venue';
import { VenueService } from '@features/venue/services/venue.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CreateVenueCardComponent } from '@shared/components/create-venue-card/create-venue-card.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { LoadingTextComponent } from '@shared/components/loading-text/loading-text.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';
import { User, UserRole } from '@user/interfaces/user';
import { UserService } from '@user/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ButtonComponent,
    ModalComponent,
    LayoutComponent,
    TimeFormatPipe,
    CreateVenueCardComponent,
    LoadingTextComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly venueService = inject(VenueService);
  private readonly fieldService = inject(FieldService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  user!: User;
  venue!: Venue;
  loading = false;
  loadingVenue = false;
  fieldsCount = 0;
  userRole = UserRole;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  isOpen = signal(false);

  ngOnInit(): void {
    this.loadingVenue = true;
    this.authService.currentUser$
      .pipe(
        switchMap(user => {
          if (!user) return EMPTY;
          this.user = user;
          return this.venueService.getMyVenue();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: data => {
          this.loadingVenue = false;
          if (data) {
            this.venue = data;
            this.loadFieldsCount();
          }
        },
        error: (err: ErrorResponse) => {
          this.loadingVenue = false;
          this.alertService.error(
            'Error al obtener complejo deportivo',
            err.error.message || 'Error inesperado'
          );
        }
      });
  }

  private loadFieldsCount(): void {
    this.fieldService.getFieldsByVenueId(this.venue.id).subscribe({
      next: fields => {
        this.fieldsCount = fields.length;
      },
      error: (err: ErrorResponse) => {
        this.alertService.error(
          'Error al obtener canchas',
          err.error.message || 'Error inesperado'
        );
      }
    });
  }

  openModal() {
    document.body.style.overflow = 'hidden';
    this.isOpen.set(true);
  }

  onClosed() {
    this.selectedFile = null;
    this.imagePreview = null;

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    } else {
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
      next: updatedUser => this.handleSuccess(updatedUser),
      error: err => {
        this.alertService.error('Error', err.error?.message || 'Error al subir la imagen');
        this.loading = false;
      }
    });
  }

  private handleSuccess(updatedUser: User) {
    this.authService.setUser(updatedUser);
    this.loading = false;
    this.alertService.success('Foto Actualizada', 'Tu imagen de perfil ha sido cambiada.');

    this.onClosed();

    this.user = updatedUser;
  }

  getImageUrl(user: User): string {
    return user.imageUrl?.startsWith('http') ? user.imageUrl : '/assets/profile_icon.webp';
  }

  logout(): void {
    this.alertService
      .confirm('¿Cerrar sesión?', '¿Estás seguro de que deseas cerrar sesión?', 'Si, cerrar sesión', 'Cancelar', '#dc2626')
      .then(confirmed => {
        if (confirmed) {
          this.authService.logout();
          this.alertService.success('Sesión cerrada', 'Has cerrado sesión correctamente.');
        }
      });
  }
}