// auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../firebase.init';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSignal = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.userSignal.set(user);
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  logout() {
    return signOut(auth).then(() => {
      this.userSignal.set(null);
    });
  }

  isLoggedIn = computed(() => !!this.userSignal());

  getUser = computed(() => this.userSignal());
}
