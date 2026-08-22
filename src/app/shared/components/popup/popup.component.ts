import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PopupService } from '@core/services/popup.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './popup.component.html'
})
export class PopupComponent {
  public popupService = inject(PopupService);
  closedPopup: boolean;

  constructor() {
    this.closedPopup = this.popupService.isClosed();
  }
}
