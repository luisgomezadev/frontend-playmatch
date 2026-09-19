import { Service } from "@angular/core";

@Service()
export class PopupService {
  private readonly key = 'closed-popup';
  private readonly ttl = 24 * 60 * 60 * 1000;

  isClosed(): boolean {
    try {
      const closedAt = Number(localStorage.getItem(this.key));

      if (!closedAt) return false;

      const elapsed = Date.now() - closedAt;

      if (elapsed >= 0 && elapsed < this.ttl) return true;

      localStorage.removeItem(this.key);
      return false;
    } catch {
      return false;
    }
  }

  closePopup(): void {
    try {
      localStorage.setItem(this.key, Date.now().toString());
    } catch {
      console.error('Error al guardar el estado del popup en localStorage');
    }
  }
}