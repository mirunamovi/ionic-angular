import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { TrackInterface } from '../ts/interfaces/track';
import { IRun } from '../shared/run.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityListService {

  // private apiUrl = 'http://192.168.0.116:4000'; // Replace with your backend API URL
  // private apiUrl = 'http://192.168.43.66:4000'; // Replace with your backend API URL
  // private apiUrl = 'http://localhost:4000'; // Replace with your backend API URL
  private apiUrl = 'http://192.168.0.105:4000'; // Replace with your backend API URL


  constructor(private http: HttpClient) { }

  getTracks(): Observable<any>{
    console.log("Am intrat in getTracks")
    return this.http.get(`${this.apiUrl}/tracks`).pipe(
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
