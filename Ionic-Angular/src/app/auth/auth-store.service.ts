import { Injectable } from '@angular/core';
import { CredentialsInterface, UserInterface } from '../ts/interfaces';
import { LocalStorage } from '../ts/enum';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStoreService {
  refreshToken: string | null = null;
  accessToken: string | null = null;
  user: UserInterface | null = null;
  private accessTokenKey = 'access-token';
  private refreshTokenKey = 'refresh-token';

  constructor(private http: HttpClient) {
    this.refreshToken = localStorage.getItem(LocalStorage.RefreshToken);
    this.accessToken = localStorage.getItem(LocalStorage.AccessToken);
    
  }

  get isAuthenticated(): boolean {
    return !!this.user;
  }

  login({ accessToken, refreshToken, user }: CredentialsInterface): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
    this.setUserInfo(user);
  }

  logout(): void {
    console.log("am ajuns in logout din authstore");
    this.setAccessToken(null);
    this.setRefreshToken(null);
    this.setUserInfo(null);
    console.log("Access token: " + this.accessToken);
    console.log("Refresh token: " + this.refreshToken);

  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;

    if (!token) {
      localStorage.removeItem(LocalStorage.AccessToken);
      return;
    }

    localStorage.setItem(LocalStorage.AccessToken, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  setRefreshToken(token: string | null): void {
    this.refreshToken = token;

    if (!token) {
      localStorage.removeItem(LocalStorage.RefreshToken);
      return;
    }

    localStorage.setItem(LocalStorage.RefreshToken, token);
  }

  setUserInfo(user: UserInterface | null): void {
    this.user = user;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<{ accessToken: string }>('your-refresh-token-endpoint', { refreshToken })
      .pipe(
        map(response => {
          this.setTokens(response.accessToken, refreshToken);
          return response.accessToken;
        })
      );
  }





}
