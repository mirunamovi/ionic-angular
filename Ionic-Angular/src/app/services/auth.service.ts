// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000'; // Replace with your backend API URL

  constructor(private http: HttpClient) { }

  // Method to handle user login
  login(credentials: { email: string, password: string }) {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // Method to handle user registration
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
