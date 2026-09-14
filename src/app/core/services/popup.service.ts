import { Service } from "@angular/core";

@Service()
export class PopupService {
  private readonly key = 'closed-popup';

  isClosed(): boolean {
    return !!localStorage.getItem(this.key);
  }

  closePopup() {
    localStorage.setItem(this.key, 'true');
  }
}
