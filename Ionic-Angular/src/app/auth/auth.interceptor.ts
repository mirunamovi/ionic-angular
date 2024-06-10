import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthStoreService } from './auth-store.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authStoreService: AuthStoreService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access-token');
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Access token might be expired, try refreshing
          return this.authStoreService.refreshAccessToken().pipe(
            switchMap(newAccessToken => {
              request = request.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` }
              });
              return next.handle(request);
            }),
            catchError(refreshError => {
              this.authStoreService.clearTokens();
              this.router.navigate(['/login']);
              return throwError(refreshError);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}