import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {
  private apiUrl = 'http://mimovi.go.ro:4000';

  constructor(private http: HttpClient) {}

  getThumbnail(thumbnail: string): Observable<Blob> {
    console.log('Fetching thumbnail');
    return this.http.get(`${this.apiUrl}/tracks/thumbnail/${thumbnail}`, { responseType: 'blob' }).pipe(
      tap((response: Blob) => {
        console.log('GET request successful:', response);
      }),
      catchError(error => {
        console.error('Error occurred during GET request:', error);
        return throwError(error);
      })
    );
  }

  getImageUrl(filename: string): string {
    return `${this.apiUrl}/uploads/${filename}`;
  }
}
