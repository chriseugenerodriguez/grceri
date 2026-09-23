import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
export interface ILocalStorage {
  get(key: string, defaultValue?: any): Observable<any>;
  set(key: string, value: any): void;
  remove(key: string): void;
}
@Injectable()
export class LocalStorage implements ILocalStorage {
  protected subjects: { [key: string]: BehaviorSubject<any> } = {};
  constructor(@Inject(PLATFORM_ID) private platform: any) { }
  get(key: string, defaultValue: any = null): Observable<any> {
    if (this.subjects[key]) return this.subjects[key];
    let value = defaultValue;
    if (isPlatformBrowser(this.platform)) {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored !== null) value = JSON.parse(stored);
      } catch { /* Corrupt or unavailable storage must not prevent browsing. */ }
    }
    return this.subjects[key] = new BehaviorSubject(value);
  }
  set(key: string, value: any): void {
    if (isPlatformBrowser(this.platform)) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { }
    }
    if (this.subjects[key]) this.subjects[key].next(value);
  }
  remove(key: string): void {
    if (isPlatformBrowser(this.platform)) {
      try { window.localStorage.removeItem(key); } catch { }
    }
    if (this.subjects[key]) this.subjects[key].next(null);
  }
}
