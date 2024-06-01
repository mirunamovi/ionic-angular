// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CredentialsInterface, LoginInterface, TokensInterface, UserInterface } from '../ts/interfaces';
import { AuthStoreService } from './auth-store.service';
import { ApiRoutes } from '../ts/enum/api-routes';
import { AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_PREFIX } from './interceptors/token.interceptor';
import { SignUpInterface } from '../ts/interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'http://192.168.0.116:4000'; // Replace with your backend API URL
  // private apiUrl = 'http://localhost:4000'; // Replace with your backend API URL
  // private apiUrl = 'http://192.168.46.213:4000'; // Replace with your backend API URL
  // private apiUrl = 'http://192.168.0.109:4000'; // Replace with your backend API URL
  private apiUrl = 'http://mimovi.go.ro:4000'; // Replace with your backend API URL



  constructor(private http: HttpClient, private authStore: AuthStoreService, private router: Router,) { }

  get hasAccessToken(): boolean {
    return !!this.authStore.accessToken;
  }


  login(payload: LoginInterface): Observable<CredentialsInterface> {
    return this.http.post<CredentialsInterface>(`${this.apiUrl}/auth/signin`, payload).pipe(
      map((credentials: CredentialsInterface) => {
        this.authStore.login(credentials);
        return credentials;
      })
    );
  }

  // Method to handle user registration
  register(payload: SignUpInterface): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, payload).pipe(
      catchError(error => {
        return throwError(() => new Error(error));
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  logout(){
    console.log("am intrat in logout din authservice");
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.authStore.logout();
        console.log('Navigating to login');
        this.router.navigate(['/login']).then((success: any) => {
          if (success) {
            console.log('Navigation to login successful');
          } else {
            console.log('Navigation to login failed');
          }
        }).catch((err: any) => {
          console.error('Navigation error:', err);
        });
      }),
      catchError(error => {
        console.error('Logout failed', error);
        return throwError(error);
      })
    );
  }
  

  // getUserInfo(): Observable<UserInterface> {
  //   return this.http.get<UserInterface>(ApiRoutes.UserInfo).pipe(
  //     map((user: UserInterface) => {
  //       this.authStore.setUserInfo(user);
  //       return user;
  //     })
  //   );
  // }


  refreshToken(): Observable<TokensInterface> {
    const headers = {
      [AUTHORIZATION_HEADER_KEY]: `${AUTHORIZATION_HEADER_PREFIX} ${this.authStore.refreshToken}`,
    };
    return this.http.get<TokensInterface>(`${this.apiUrl}/auth/refresh`, { headers }).pipe(
      map(({ accessToken, refreshToken }: TokensInterface) => {
        this.authStore.setAccessToken(accessToken);
        this.authStore.setRefreshToken(refreshToken);
        return { accessToken, refreshToken };
      })
    );
  }


}
