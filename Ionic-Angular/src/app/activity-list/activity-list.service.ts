import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { TrackInterface } from '../ts/interfaces/track';
import { IRun } from '../shared/run.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityListService {

  private apiUrl = 'http://mimovi.go.ro:4000'; 

  constructor(private http: HttpClient) { }

  getTracks(): Observable<any>{
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
