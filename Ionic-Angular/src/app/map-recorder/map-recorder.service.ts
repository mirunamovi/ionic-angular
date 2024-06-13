import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, switchMap, tap, throwError } from 'rxjs';
import { CredentialsInterface } from '../ts/interfaces';
import { TrackInterface } from '../ts/interfaces/track';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {
//   BackgroundGeolocationPlugin,
//   ConfigureOptions,
//   Location,
// } from "cordova-plugin-background-geolocation";

@Injectable({
  providedIn: 'root'
})
export class MapRecorderService {
  // private apiUrl = 'http://192.168.0.116:4000'; // Replace with your backend API URL
    // private apiUrl = 'http://localhost:4000'; // Replace with your backend API URL
    // private apiUrl = 'http://192.168.46.213:4000'; // Replace with your backend API URL
    private apiUrl = 'http://192.168.0.109:4000'; // Replace with your backend API URL
    // private apiUrl = 'http://mimovi.go.ro:4000'; // Replace with your backend API URL

    


  constructor(private http: HttpClient) { }

  // declare BackgroundGeolocation: BackgroundGeolocationPlugin;

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

  createTrackOnline(blob: Blob, payload: TrackInterface): Observable<any> {
    const formData = new FormData();
    formData.append('file', blob, 'track.gpx'); // Append the blob as a file
    formData.append('payload', JSON.stringify(payload)); // Append the payload as JSON string

    return this.http.post(`${this.apiUrl}/tracks`, formData)
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

  uploadTracks(file: File, payload: TrackInterface): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Append the file to FormData
    formData.append('payload', JSON.stringify(payload)); // Append the payload as JSON string

    return this.http.post(`${this.apiUrl}/tracks/upload`, formData)
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
