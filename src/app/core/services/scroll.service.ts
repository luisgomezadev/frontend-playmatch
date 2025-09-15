import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  scrollToTop(containerSelector?: string): void {
    if (containerSelector) {
      const contenedor = document.querySelector(containerSelector) as HTMLElement | null;
      contenedor?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
