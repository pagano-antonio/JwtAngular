import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, catchError, of } from 'rxjs';

export function canActivateRole(allowed: string[]): CanActivateFn {
    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);


        if (!auth.token) return router.parseUrl('/login');

        // se il profilo è già in memoria
        const u = auth.user();
        if (u) {
            return allowed.includes(u.role) ? true : router.parseUrl('/forbidden');
        }

        return auth.fetchProfile().pipe(
            map(profile => {
                console.log("Ruolo utente:", profile.role);
                return allowed.includes(profile.role)
                    ? true
                    : router.parseUrl('/forbidden');
            }
            ),
            catchError(
                () => of(router.parseUrl('/login'))) // token invalido/scaduto
        );
    };
}
