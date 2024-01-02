import { Injectable, Optional } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  OAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  redirect = ['/'];

  constructor(
    @Optional() private auth: Auth,
    public afAuth: Auth,
    private router: Router
  ) {
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(this.redirect);
  }

  async register(email: string, password: string) {

    return await createUserWithEmailAndPassword(this.auth, email.trim().toLowerCase(), password);
  }

  async sendVerification() {
    return await sendEmailVerification(this.afAuth.currentUser!);
  }

  async logout() {
    return await this.afAuth.signOut();
  }

  isLoggedIn() {
    return !!this.auth.currentUser;
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    await this.router.navigate(this.redirect);
  }

  async loginWithTwitter() {
    const provider = new TwitterAuthProvider();
    await signInWithPopup(this.auth, provider);
    await this.router.navigate(this.redirect);
  }

  async loginWithGithub() {
    const provider = new GithubAuthProvider();
    await signInWithPopup(this.auth, provider);
    await this.router.navigate(this.redirect);
  }

  async loginWithCustom(website: string) {
    const provider = new OAuthProvider(website);
    await signInWithPopup(this.auth, provider);
    await this.router.navigate(this.redirect);
  }
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.afAuth, email);
  }
}
