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

  // get authToken(): Observable<string> {
  //   return from(localStorage.getItem('access-token'))
  // };
  
//   sendRequest():Observable<ReturnedObject> {
//     this.authToken.pipe(switchMap(token => {
//       return this.http
//         .get(base_prod_api_url + "dashboard", {
//           headers: {
// //             "Content-Type": globals.content_type,
// //             Authorization: "Bearer " + token
//           }
//         })
//     }));
// }
  createTracks(payload:TrackInterface): Observable<any>{

    // Retrieve the token from local storage
    const token = localStorage.getItem('access-token');
    console.log(token);
    // Check if token exists
    if (!token) {
      return throwError('Token not found in local storage');
    }

    // Set up the request headers with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log(headers);
    

    return this.http.post(`${this.apiUrl}/tracks`, payload, {headers}
                // headers: {
                //   "Content-Type": 'application/json',
                //   Authorization: "Bearer " + token
                // }
              ).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
    // .pipe(
    //   tap((response: any) => {
    //     console.log('POST request successful:', response);
    //   }),
    //   catchError(error => {
    //     console.error('Error occurred during POST request:', error);
    //     return throwError(error);
    //   })
    // );
  }

  // createTracks(payload:TrackInterface): Observable<CredentialsInterface>{
  //   console.log(payload);
  //   return this.http.post<CredentialsInterface>(`${this.apiUrl}/tracks`, payload).pipe(
  //     map((credentials: CredentialsInterface) => {
  //     return credentials;
  //   }),
  //     tap((response: any) => {
  //       alert(response);
  //       console.log('POST request successful:', response);
  //     }),
  //     catchError(error => {
  //       alert(error);
  //       console.error('Error occurred during POST request:', error);
  //       return throwError(error);
  //     })
  //   );
  // }

}
