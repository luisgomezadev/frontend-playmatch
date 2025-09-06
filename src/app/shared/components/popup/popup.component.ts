import { Component, inject } from '@angular/core';
import { PopupService } from '@core/services/popup.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './popup.component.html'
})
export class PopupComponent {
  public popupService = inject(PopupService);
  closedPopup: boolean;

  constructor() {
    this.closedPopup = this.popupService.isClosed();
  }
}
