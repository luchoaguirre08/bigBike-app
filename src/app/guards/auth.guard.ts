import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = getAuth();

  // Esperar a que Firebase diga si hay usuario o no
  const user = await new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub(); // Evita múltiples llamados
      resolve(user);
    });
  });

  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
