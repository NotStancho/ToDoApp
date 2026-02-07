import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import AuthService from './auth.service';
import { ToastService } from '../../ui/toast/toast.service';

const authEndpoints = ['/api/User/login', '/api/User/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  const token = auth.accessToken;
  const isAuthEndpoint = authEndpoints.some((endpoint) => req.url.includes(endpoint));

  const authReq =
    token && !isAuthEndpoint
      ? req.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      })
      : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error?.status && error.status !== 401 && !isAuthEndpoint) {
        const message =
          error?.error?.message ||
          error?.message ||
          'Something went wrong';

        toast.error(message);
      }

      if (error?.status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }

      if (req.url.includes('/api/User/refresh-token')) {
        return throwError(() => error);
      }

      return auth.refreshAccessToken().pipe(
        switchMap(() => {
          const refreshedToken = auth.accessToken;
          if (!refreshedToken) {
            return throwError(() => error);
          }

          return next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshedToken}`
              }
            })
          );
        })
      );
    })
  );
};
