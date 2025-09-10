// src/app/core/auth/refresh.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';

let refreshing = false;
const refresh$ = new Subject<string>();

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            // Non tentare refresh su endpoint di auth/refresh per evitare loop
            const isAuthUrl = req.url.includes('/auth/login') || req.url.includes('/auth/refresh-token');
            if (err.status !== 401 || isAuthUrl) {
                return throwError(() => err);
            }

            // Se non ho refresh token → logout “soft”
            if (!auth.refreshToken) {
                auth.logout();
                return throwError(() => err);
            }

            if (!refreshing) {
                refreshing = true;
                return auth.refreshAccessToken().pipe(
                    switchMap((_) => {
                        refreshing = false;
                        // Notifica gli altri in coda
                        refresh$.next('ok');

                        // Ripeti la richiesta originale con nuovo AT (l'authInterceptor lo metterà)
                        return next(req.clone());
                    }),
                    catchError(e => {
                        refreshing = false;
                        auth.logout();
                        refresh$.error(e);
                        return throwError(() => e);
                    })
                );
            } else {
                // C'è già un refresh in corso → attendi
                return refresh$.pipe(
                    take(1),
                    switchMap(() => next(req.clone()))
                );
            }
        })
    );
};
