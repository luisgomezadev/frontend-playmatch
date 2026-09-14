import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Service()
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  show() {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }
}
