// / background-geolocation.service.ts

// import { Injectable } from '@angular/core';
// import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class BackgroundGeolocationService {
//   constructor(private backgroundGeolocation: BackgroundGeolocation) {}

//   startBackgroundGeolocation(): Observable<BackgroundGeolocationResponse> {
//     const config: BackgroundGeolocationConfig = {
//       desiredAccuracy: 10,
//       stationaryRadius: 20,
//       distanceFilter: 30,
//       interval: 5000,
//       fastestInterval: 5000,
//       activitiesInterval: 10000,
//       debug: true,
//       stopOnTerminate: false,
//       startForeground: true,
//       startOnBoot: true,
//       saveBatteryOnBackground: true
//     };

//     this.backgroundGeolocation.configure(config);
//     this.backgroundGeolocation.start();

//     return this.backgroundGeolocation.onLocation();
//   }
// }