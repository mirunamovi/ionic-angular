// import { Component, NgZone } from '@angular/core'
// import { Subscription } from 'rxjs'
// import { Geolocation } from '@ionic-native/geolocation'
// import { BackgroundMode } from '@ionic-native/background-mode/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
// import { NavController, Platform, ToastController } from '@ionic/angular'
// import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation'

// interface CurrentLocation {
//   latitude: Number
//   longitude: Number
//   date: Date | null
// }

// @Component({
//   selector: 'page-home',
//   templateUrl: 'home.html'
// })
// export class HomePage {
//   inBackground = false
//   currentLocation: CurrentLocation = {
//     latitude: 0,
//     longitude: 0,
//     date: null
//   };
//   savedLocations = [];
//   isLocationEnabled = false;
//   backgroundModeEnabled = false;
//   private watchSubscription!: Subscription;
//   private onResumeSubscription: Subscription;
//   private onPauseSubscription: Subscription;
//   backgroundGeolocationConfig: BackgroundGeolocationConfig = {
//     desiredAccuracy: 10,
//     stationaryRadius: 20,
//     distanceFilter: 10,
//     debug: true, //  enable this hear sounds for background-geolocation life-cycle.
//     stopOnTerminate: false, // enable this to clear background location settings when the app terminates
//     // Android only section
//     locationProvider: 1,
//     startForeground: true,
//     interval: 6000,
//     fastestInterval: 5000,
//     activitiesInterval: 10000,
//     startOnBoot: true, // Start background service on device boot
//     // iOS only section
//     pauseLocationUpdates: false, // Pauses location updates when app is paused
//   };
//   geolocationConfig = {
//     timeout: 5000,
//     frequency: 5000,
//     enableHighAccuracy: false
//   };

//   constructor(
//     public zone: NgZone,
//     private platform: Platform,
//     public navCtrl: NavController,
//     private geolocation: Geolocation,
//     private toastCtrl: ToastController,
//     private backgroundMode: BackgroundMode,
//     private localNotifications: LocalNotifications,
//     private backgroundGeolocation: BackgroundGeolocation) {

//     this.platform.ready().then(() => {
//       this.backgroundModeEnabled = this.backgroundMode.isEnabled()
//     })
    
//     this.onResumeSubscription = platform.resume.subscribe(() => this.onResume())
//     this.onPauseSubscription = platform.pause.subscribe(() => this.onPause())

//     this.platform.ready().then(() => {
//         this.backgroundModeEnabled = this.backgroundMode.isEnabled();
    
//         if (this.platform.is('cordova')) {
//           this.watchPosition();
//         }
//       });
//   }

//   watchPosition() {

//     if (this.watchSubscription) {
//         this.watchSubscription.unsubscribe();
//       }

//     this.watchSubscription = this.geolocation.watchPosition(
//     (position) => { // Success callback function
//       if (position.coords) {
//         this.zone.run(() => {
//           this.setNewLocation(position.coords.latitude, position.coords.longitude);
//         });
//       }
//     },
//     (error) => { // Error callback function
//       console.error('Error getting location', error);
//     },
//     { 
//       timeout: 5000,
//       maximumAge: 5000,
//       enableHighAccuracy: false 
//     }
//   ).subscribe(); 
//   }

//   //The event fires when an application is retrieved from the background
//   async onResume() {
//     this.inBackground = false;
//     this.showToast('Bienvenido de nuevo!');
//     let lastLocation: CurrentLocation | null = null;
//     if (this.savedLocations.length) {
//       lastLocation = this.savedLocations[this.savedLocations.length-1]
//       this.savedLocations = []
//     }
//     if (this.platform.is('cordova')) {
//       const locations = await this.backgroundGeolocation.getLocations()
//       if (locations && locations.length) {
//         lastLocation = locations[locations.length-1]
//       }
//     }
//     if (lastLocation) {
//       this.setNewLocation(lastLocation.latitude, lastLocation.longitude)
//     }
//   }

//   onPause() {
//     this.inBackground = true
//     this.savedLocations = []
//     this.showNotification('App en pausa')
//   }

//   async ionViewWillEnter() {
//     await this.platform.ready()
//     if (this.platform.is('cordova')) {
//       this.isLocationEnabled = !!(await this.backgroundGeolocation.isLocationEnabled())
//     }
//   }

//   async startTracking() {
//     await this.platform.ready();
//     if (this.platform.is('cordova')) {
//         // Support Background Tracking
//         this.backgroundGeolocation.configure(this.backgroundGeolocationConfig);

//         // Listen for location updates
//         this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
//             this.zone.run(() => {
//                 this.setNewLocation(location.latitude, location.longitude);
//             });
//         });

//         this.backgroundGeolocation.start();
//     }

//     // Only Foreground Tracking
//     this.watchPosition();

//     this.isLocationEnabled = true;
// }
//   setNewLocation(latitude: number, longitude: number) {
//     const newLocation: CurrentLocation = {
//       latitude: latitude,
//       longitude: longitude,
//       date: new Date()
//     }
//     console.log(JSON.stringify(newLocation))
//     this.zone.run(() => {
//       this.currentLocation = newLocation
//       this.savedLocations.push(this.currentLocation)
//       if (this.inBackground) {
//         this.showNotification(`Nueva ubicación => Lat: ${newLocation.latitude}, Lon: ${newLocation.longitude}`)
//       }
//     })
//   }

//   stopTracking() {
//     this.showToast('Seguimiento detenido')
//     this.showNotification('Seguimiento detenido')
//     this.unsubscribeWatch()
//     if (this.platform.is('cordova')) {
//       this.backgroundGeolocation.finish()
//       this.backgroundGeolocation.stop()
//     }
//   }

//   toggleBackgroundMode() {
//     if (!this.backgroundMode.isEnabled()) {
//       this.backgroundMode.enable()
//       this.backgroundModeEnabled = true
//       //this.backgroundMode.moveToBackground()
//       //this.backgroundMode.disableWebViewOptimizations()
//     }
//     else {
//       this.backgroundMode.disable()
//       this.backgroundModeEnabled = false
//       //this.backgroundMode.moveToForeground()
//     }
//   }

//   async showToast(message: string) {
//     (await this.toastCtrl.create({
//           message: message,
//           duration: 3000,
//           position: 'bottom'
//       })).present()
//   }

//   showNotification(text: string) {
//     this.localNotifications.schedule({
//       text: text,
//       led: 'FF0000',
//     })
//   }

//   unsubscribeWatch() {
//     this.isLocationEnabled = false
//     this.watchSubscription && this.watchSubscription.unsubscribe()
//   }

//   ngOnDestroy() {
//     this.showNotification('App detenida')
//     // always unsubscribe your subscriptions to prevent leaks
//     this.onResumeSubscription.unsubscribe()
//     this.onPauseSubscription.unsubscribe()
//     this.unsubscribeWatch()
//     if (this.platform.is('cordova') && this.platform.is('ios')) {
//       this.backgroundGeolocation.finish()
//     }
//   }
// }











// // import {Injectable } from "@angular/core";
// // import { log } from "./log";
// // import { BackgroundGeolocation, BackgroundMode, Geolocation, Geoposition} from '@ionic-native';
// // import Timer = NodeJS.Timer;
// // import { Platform, Events} from "@ionic/angular";
// // import { Observable} from "rxjs";

// // @Injectable()
// // export class BackgroundGeolocationService {

// //     trackerInterval: Timer;
// //     locations: any;
// //     public watch: any;

// //     // BackgroundGeolocation is highly configurable. See platform specific configuration options
// //     backGroundConfig = {
// //         interval: 1000,
// //         locationTimeout: 500,
// //         desiredAccuracy: 10,
// //         stationaryRadius: 20,
// //         distanceFilter: 30,
// //         debug: true, //  enable this hear sounds for background-geolocation life-cycle.
// //         stopOnTerminate: false, // enable this to clear background location settings when the app terminates
// //         maxLocations: 100, //default = 10000
// //     };


// //     // Foreground Tracking
// //     foreGroundOptions = {
// //         frequency: 2000,
// //         enableHighAccuracy: true,
// //         maximumAge: Infinity,
// //         timeout: 2000
// //     };

// //     constructor(private platform: Platform, public trace: log, private events: Events) {

// //         if (this.platform.is('android')) {
// //             this.platform.ready().then(() => {
// //                 this.startTracking();

// //             }).catch(err => {
// //                 this.trace.error('BackgroundGeolocationService', 'constructor', `error:${err}`);
// //             });

// //         }
// //     }

// //     foreGroundWatchPosition() {
// //         this.watch = Geolocation.watchPosition(this.foreGroundOptions)
// //             .subscribe((position: any) => {
// //                     if (position.code === undefined) {
// //                         this.events.publish('BackgroundGeolocationService:setCurrentForegroundLocation', position);
// //                     } else {
// //                         this.trace.error('BackgroundGeolocationService','constructor',position.message);
// //                     }
// //                 },
// //                 (error)=>{this.trace.error('BackgroundGeolocationService','foreGroundWatchPosition',error)},
// //                 ()=>this.trace.info('watchPosition success'));

// //     }

// //     backgroundConfigureAndStart() {
// //         this.trace.info(`Background tracking` );
// //         BackgroundGeolocation.configure(
// //             (location) => {
// //                 this.trace.info(`configure  ${location.latitude},${location.longitude}`);

// //                 this.setCurrentLocation(location);
// //                 this.trackerInterval = setInterval(() => {
// //                     this.refreshLocations();
// //                 }, 2000);

// //                 // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
// //                 // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
// //                 // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
// //                 //BackgroundGeolocation.finish(); // FOR IOS ONLY

// //             }, (error) => {
// //                 this.trace.error('BackgroundGeolocationService','constructor',error);
// //             }, this.backGroundConfig);
// //     }


// //     refreshLocations(): void {
// //         BackgroundGeolocation.getLocations().then(locations => {
// //             this.locations = locations;
// //             if (locations.length != 0) {
// //                 this.trace.info(`lngth ${locations.length}`);
// //                 this.setCurrentLocation(locations[locations.length-1]);
// //             }
// //         }).catch(error => {
// //             this.trace.error('BackgroundGeolocationService','refreshLocations', `error:${error.toString()}`);
// //         });

// //         // Foreground Tracking
// //         Geolocation.getCurrentPosition(this.foreGroundOptions)
// //             .then((position: Geoposition) => {
// //                 this.trace.info(`Foregrnd current ${position.coords.latitude},${position.coords.longitude}`);
// //             }).catch((error)=>{
// //                 if ((error.code == undefined) || (error.code != 3)) { //3=timeout
// //                     this.trace.error('BackgroundGeolocationService', 'refreshLocations', `error Foregrnd.getCurrentPos:${error.toString()}`);
// //                 }
// //             });
// //     }

// //     startTracking(): void {
// //         this.trace.info('startTracker');
// //         this.foreGroundWatchPosition();
// //         this.backgroundConfigureAndStart();
// //         this.backgroundWatchLocationMode();
// //         this.backgroundIsLocationEnabled();
// //         BackgroundMode.setDefaults({ text:'Doing geoloc tasks.'});
// //         BackgroundMode.enable();
// //         this.backGroundOnActivate();
// //     }

// //     backgroundWatchLocationMode() {
// //         this.trace.info('backgroundWatchLocationMode');
// //         BackgroundGeolocation.watchLocationMode()
// //             .then((enabled)=>{
// //                 if (enabled) {
// //                     // location service are now enabled
// //                     // call backgroundGeolocation.start
// //                     // only if user already has expressed intent to start service
// //                     this.trace.info('backgroundGeolocation enabled');
// //                 } else {
// //                     // location service are now disabled or we don't have permission
// //                     // time to change UI to reflect that
// //                     this.trace.info('backgroundGeolocation disabled');
// //                 }
// //             },
// //             (error)=>{
// //                 this.trace.error('BackgroundGeolocationService','backgroundWatchLocationMode','Error watching location mode. Error:' + error);
// //             }
// //         );
// //     }

// //     backgroundIsLocationEnabled() {
// //         this.trace.info('backgroundIsLocationEnabled');
// //         BackgroundGeolocation.isLocationEnabled()
// //             .then((enabled)=> {
// //                 if (enabled) {
// //                     this.trace.info('backgroundIsLocationEnabled enabled');
// //                     BackgroundGeolocation.start()
// //                         .then(()=>{
// //                             // service started successfully
// //                             // you should adjust your app UI for example change switch element to indicate
// //                             // that service is running
// //                             this.trace.info('backgroundIsLocationEnabled start');
// //                             BackgroundGeolocation.deleteAllLocations();
// //                             BackgroundGeolocation.start();
// //                         },
// //                         (error)=>{
// //                             // Tracking has not started because of error
// //                             // you should adjust your app UI for example change switch element to indicate
// //                             // that service is not running
// //                             if (error.code === 2) {
// //                                 //'Not authorized for location updates
// //                             } else {
// //                                 this.trace.error('BackgroundGeolocationService','backgroundIsLocationEnabled','Start failed: ' + error.message);
// //                             }
// //                         }
// //                         );
// //                 } else {
// //                     // Location services are disabled
// //                     this.trace.info('backgroundIsLocationEnabled disabled');
// //                 }
// //             });
// //     }

// //     backGroundOnActivate() {
// //         // Called when background mode has been activated
// //         BackgroundMode.onactivate = () => {
// //             return new Observable(observer=>{
// //                 setTimeout(function () {
// //                     // Modify the currently displayed notification
// //                     observer.next('one');
// //                     BackgroundMode.configure({
// //                         text:'background for more than 1s now.'
// //                     });
// //                 }, 1000);

// //                 setTimeout(function () {
// //                     // Modify the currently displayed notification
// //                     observer.next('two');
// //                     BackgroundMode.configure({
// //                         text:'background for more than 5s now.'
// //                     });
// //                 }, 5000);

// //                 setTimeout(function () {
// //                     // Modify the currently displayed notification
// //                     observer.complete();
// //                     BackgroundMode.configure({
// //                         text:' background for more than 10s.'
// //                     });
// //                 }, 10000);

// //             });
// //         };

// //         BackgroundMode.onactivate().subscribe(
// //             value => this.trace.info(`onactivate value:${value}`),
// //             error => this.trace.error('BackgroundGeolocationService','backGroundOnActivate',`error:${error}`),
// //             () => this.trace.info(`finished`)
// //         );

// //     }

// //     setCurrentLocation(location: {latitude:string, longitude:string}) {
// //         this.events.publish('BackgroundGeolocationService:setCurrentLocation', location);
// //     }

// //     stopTracking(): void {
// //         clearInterval(this.trackerInterval);
// //         BackgroundGeolocation.getLocations().then(locations => {
// //             this.locations = locations;
// //             if (locations.length != 0) {
// //                 this.setCurrentLocation(locations[locations.length-1]);
// //             }
// //         }).catch(error => {
// //             this.trace.error('BackgroundGeolocationService','stopTracking',error);
// //         });
// //         BackgroundGeolocation.stop();
// //     }
// // }