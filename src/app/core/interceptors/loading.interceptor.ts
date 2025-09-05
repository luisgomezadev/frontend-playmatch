import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

let requests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  if (requests === 0) {
    loadingService.show();
  }
  requests++;

  return next(req).pipe(
    finalize(() => {
      console.log(requests);

      requests--;
      if (requests === 0) {
        loadingService.hide();
      }
    })
  );
};
