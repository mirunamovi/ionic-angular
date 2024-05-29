import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapViewService {
  constructor(private http: HttpClient) {}

  getGpxFile(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' }); // responseType as text for GPX file
  }
}