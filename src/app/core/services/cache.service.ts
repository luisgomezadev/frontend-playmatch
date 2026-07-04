import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

interface CacheEntry<T> {
  expiration: number;
  observable: Observable<T>;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private readonly DEFAULT_TTL = 5 * 60 * 1000;

  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(
    key: string,
    request: () => Observable<T>,
    ttl: number = this.DEFAULT_TTL
  ): Observable<T> {

    const now = Date.now();

    const cached = this.cache.get(key);

    if (cached && cached.expiration > now) {
      return cached.observable as Observable<T>;
    }

    const observable = request().pipe(
      shareReplay(1)
    );

    this.cache.set(key, {
      observable,
      expiration: now + ttl
    });

    return observable;
  }

  remove(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  clearByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}