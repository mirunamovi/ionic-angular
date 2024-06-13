import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Track } from '../ts/interfaces/track';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}

  
  getTrack(trackId: string | null, url: string): Observable<Track> {
    return this.http.get<Track>(`${url}${trackId}`);
  }

  deleteTrackfromStorage(fileName: string | undefined): Observable<any>  {
    console.log("fileName: " + fileName);
    
    return this.http.delete(`http://192.168.0.109:4000/tracks/uploads/${fileName}`);

    // return this.http.delete(`http://mimovi.go.ro:4000/tracks/uploads/${fileName}`);
  } 
  
  deleteTrackfromDb(trackId: string | null, url: string): Observable<Track> {
    return this.http.delete<Track>(`${url}${trackId}`);
  }

  getGpxFile(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' }); // responseType as text for GPX file
  }

  getGpxFileBlob(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  
}