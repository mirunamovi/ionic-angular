import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, switchMap, tap, throwError } from 'rxjs';
import { CredentialsInterface } from '../ts/interfaces';
import { TrackInterface } from '../ts/interfaces/track';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapRecorderService {
  private apiUrl = 'http://192.168.0.104:4000'; // Replace with your backend API URL
    // private apiUrl = 'http://localhost:4000'; // Replace with your backend API URL


  constructor(private http: HttpClient) { }

  createTracks(payload:TrackInterface): Observable<any>{

    return this.http.post(`${this.apiUrl}/tracks`, payload)
    .pipe(
      tap((response: any) => {
        console.log('POST request successful:', response);
      }),
      catchError(error => {
        console.error('Error occurred during POST request:', error);
        return throwError(error);
      })
    
    );
  }

 
}
