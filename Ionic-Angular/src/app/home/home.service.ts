import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // private apiUrl = 'http://192.168.0.116:4000'; // Replace with your backend API URL
  // private apiUrl = 'http://192.168.46.213:4000'; // Replace with your backend API URL
  // private apiUrl = 'http://localhost:4000'; // Replace with your backend API URL
  private apiUrl = 'http://192.168.0.109:4000'; // Replace with your backend API URL
  // private apiUrl = 'http://mimovi.go.ro:4000'; // Replace with your backend API URL


  constructor(private http: HttpClient) { }

  getUser(): Observable<any>{
    console.log("Am intrat in getUsers")
    return this.http.get(`${this.apiUrl}/users`).pipe(
      tap((response: any) => {
        console.log('GET request successful:', response);
      }),
      catchError(error => {
        console.error('Error occurred during GET request:', error);
        return throwError(error);
      })
    
    );
  }
}

