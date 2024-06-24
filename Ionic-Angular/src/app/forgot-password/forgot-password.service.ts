import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResetInterface } from '../ts/interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  constructor(private http: HttpClient) {}

 private apiUrl = 'http://mimovi.go.ro:4000'; // Replace with your backend API URL
  //  private apiUrl = 'http://192.168.0.106:4000'; // Replace with your backend API URL

  forgotPasswordSendEmail(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password/send-mail/`, { email });
  }

  forgotPasswordSubmitCode(payload: ResetInterface) {
    return this.http.post(`${this.apiUrl}/forgot-password/submit-code/`, payload);
  }

}