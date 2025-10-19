import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConfirmationService } from '../shared/confirmation/confirmation.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const confirmationService = inject(ConfirmationService);

  // 1. SCHNELLER CHECK: Ist überhaupt ein Token vorhanden?
  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false; // ← Stoppt hier! User kommt NICHT auf die Seite
  }

  // 2. BACKEND-VALIDIERUNG: Ist User wirklich Admin?
  // Dieser API-Call passiert BEVOR die Seite geladen wird!
  return authService.verifyAdminStatus().pipe(
    map(isAdmin => {
      if (isAdmin) {
        return true; // ← NUR HIER darf User auf Admin-Seite!
      }

      // User ist KEIN Admin → Fehlermeldung + Redirect
      confirmationService.confirm({
        title: 'Keine Berechtigung',
        message: 'Diese Seite ist nur für Administratoren zugänglich. Du hast keine Berechtigung, auf diesen Bereich zuzugreifen.',
        confirmText: 'Zurück zur Startseite',
        type: 'danger',
        icon: 'block'
      });

      router.navigate(['/']);
      return false; // ← User kommt NICHT auf die Seite!
    }),
    catchError((error) => {
      console.error('Admin-Validierung fehlgeschlagen:', error);
      // Token ungültig oder anderer Fehler → ausloggen
      authService.logout();
      return of(false); // ← User kommt NICHT auf die Seite!
    })
  );
};