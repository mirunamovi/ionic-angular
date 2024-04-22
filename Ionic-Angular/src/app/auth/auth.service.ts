// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CredentialsInterface, LoginInterface, TokensInterface, UserInterface } from '../ts/interfaces';
import { AuthStoreService } from './auth-store.service';
import { ApiRoutes } from '../ts/enum/api-routes';
import { AUTHORIZATION_HEADER_KEY, AUTHORIZATION_HEADER_PREFIX } from './interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.0.104:4000'; // Replace with your backend API URL
  router: any;

  constructor(private http: HttpClient, private authStore: AuthStoreService) { }

  get hasAccessToken(): boolean {
    return !!this.authStore.accessToken;
  }
  // Method to handle user login
  // login(credentials: { email: string, password: string }) {
  //   return this.http.post(`${this.apiUrl}/auth/signin`, credentials);
  // }

  login(payload: LoginInterface): Observable<CredentialsInterface> {
    return this.http.post<CredentialsInterface>(`${this.apiUrl}/auth/signin`, payload).pipe(
      map((credentials: CredentialsInterface) => {
        this.authStore.login(credentials);
        return credentials;
      })
    );
  }

  // Method to handle user registration
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, userData).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // logout(){
  //   localStorage.removeItem('token');
  //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //       this.router.navigate(['']));
  // }

  logout(): Observable<void> {
    return this.http.post<void>(ApiRoutes.Logout, {}).pipe(
      map(() => {
        this.authStore.logout();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(['']));
        
      })
    );
  }

  getUserInfo(): Observable<UserInterface> {
    return this.http.get<UserInterface>(ApiRoutes.UserInfo).pipe(
      map((user: UserInterface) => {
        this.authStore.setUserInfo(user);
        return user;
      })
    );
  }


  refreshToken(): Observable<TokensInterface> {
    const headers = {
      [AUTHORIZATION_HEADER_KEY]: `${AUTHORIZATION_HEADER_PREFIX} ${this.authStore.refreshToken}`,
    };
    return this.http.get<TokensInterface>(ApiRoutes.Refresh, { headers }).pipe(
      map(({ accessToken, refreshToken }: TokensInterface) => {
        this.authStore.setAccessToken(accessToken);
        this.authStore.setRefreshToken(refreshToken);
        return { accessToken, refreshToken };
      })
    );
  }


}
