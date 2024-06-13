import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  constructor(private http: HttpClient) {}

  // private apiUrl = 'http://mimovi.go.ro:4000'; // Replace with your backend API URL
  private apiUrl = 'http://192.168.0.109:4000'; // Replace with your backend API URL

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password/`, { email });
  }
}