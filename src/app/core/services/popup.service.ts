import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class PopupService {
  private readonly key = 'closed-popup';

  isClosed(): boolean {
    return !!localStorage.getItem(this.key);
  }

  closePopup() {
    localStorage.setItem(this.key, 'true');
  }
}
