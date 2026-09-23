import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Authentication is disabled for the public preview. No SDK, tokens, or network requests.
@Injectable()
export class AuthService {
  userProfile: any = null;
  refreshSub: any;
  refreshSubscription: any;
  renew = false;
  isAuthenticated(): boolean { return false; }
  login(email: string, password: string, renew?: boolean): Observable<any> {
    return of({ description: 'Accounts are unavailable in this preview.' });
  }
  signup(email: string, password: string, plan?: string, options?: object): void { }
  resetPassword(email: string): Observable<any> { return of({ description: 'Accounts are unavailable in this preview.' }); }
  checkemail(email: string): void { }
  checkEmail(value: any): Observable<any[]> { return of([]); }
  handleAuthentication(): void { }
  scheduleRenewal(): void { }
  unscheduleRenewal(): void { }
  renewToken(): void { }
  logout(): void { this.userProfile = null; }
  getProfile(callback): void { callback(null, null); }
  changePassword(options, callback): void { callback(new Error('Accounts are unavailable in this preview.')); }
  forgotPassword(): void { }
}
