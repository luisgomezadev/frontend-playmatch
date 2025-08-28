import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {

  confirm(
    title: string,
    text: string,
    confirmButtonText = 'Aceptar',
    cancelButtonText = 'Cancelar'
  ): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText,
      cancelButtonText,
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false
    }).then(result => result.isConfirmed);
  }

  success(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'success',
      customClass: { confirmButton: 'swal-confirm-btn' },
      buttonsStyling: false
    });
  }

  error(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'error',
      customClass: { confirmButton: 'swal-confirm-btn' },
      buttonsStyling: false
    });
  }

  notify(title: string, text: string, icon: SweetAlertIcon = 'info'): void {
    Swal.fire({
      title,
      text,
      icon,
      customClass: { confirmButton: 'swal-confirm-btn' },
      buttonsStyling: false
    });
  }
}
