import { ChangeDetectorRef, Injectable, NgZone } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from "@ionic-native/background-geolocation/ngx";

@Injectable()
export class BackgroundGeolocationService {

  public logs: any[] = [];
  public watch: any;   
  public lat: number = 0;
  public lng: number = 0;
  public alt: number = 0;
  

  constructor(public zone: NgZone, public backgroundGeolocation: BackgroundGeolocation,
    private platform: Platform, private alertCtrl: AlertController) {
    console.log('Hello LocationTrackerProvider Provider');
  }

  config: BackgroundGeolocationConfig = {
    desiredAccuracy: 0, // Possible values [0, 10, 100, 1000]. The lower the value, the better the accuracy in meters obtained by the plugin.
    stationaryRadius: 1, // Value in meters (radius) where the plugin will trigger or send a response.
    distanceFilter: 10, // Value in meters (distance) where the plugin will trigger or send a response.
    debug: true, // Detailed information about the response. It emits a sound each time it detects a new record.
    stopOnTerminate: false, // If true, the background-geolocation task will stop if the application is closed or goes into the background. Remember that the plugin works in both background and foreground modes.

  };

  startBackgroundGeolocation() {
    
     // Background Tracking
     console.log('am intrat in startBackgroundGeolocation')
      if (this.platform.is('ios')) {
        this.config.locationProvider = 0;
        this.config.pauseLocationUpdates = true;
      }

      if (this.platform.is('android')) {
        console.log('android');
        this.config.locationProvider = 1; // Technique used to detect position changes.
        this.config.startForeground = true; // Enables detection of position changes when the app is in the background.
        this.config.interval = 2000; // It will be the minimum time that the plugin will be requesting the position from the device. We must take into account that the time values are conditioned with the distance values. That is, if the device does not detect movement x meters in x time, it will not request the position.
        this.config.fastestInterval = 5000;
        this.config.activitiesInterval = 10000;
      }

      this.backgroundGeolocation.configure(this.config).then(() => {
        // Background geolocation configured successfully
        console.log('BackgroundGeolocation configured');
      
        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(
          (location) => {
            console.log('BackgroundGeolocation: ' + location.latitude + ',' + location.longitude);
        
            // Run update inside of Angular's zone
            // this.zone.run(() => {
            this.logs.push({
              lat: location.latitude,
              lon: location.longitude,
              alt: location.altitude,
              time: new Date().toISOString(),
            });
            // this.cdr.detectChanges();
            console.log(this.logs);
            // });
          }
        );
      
        console.log("Before calling start()");
        // Turn ON the background-geolocation system.
        this.backgroundGeolocation.start()
          .then(() => {
            // Start successful
            console.log("BackgroundGeolocation start successful");
          })
          .catch((error) => {
            // Error occurred
            console.error("BackgroundGeolocation start error:", error);
          });
      }).catch((error) => {
        // Error configuring background geolocation
        console.error('BackgroundGeolocation initialization error:', error);
      });
    
      // Foreground Tracking



      // let options = {
      //   frequency: 3000,
      //   enableHighAccuracy: true
      // };
    
      // this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      
      //   console.log(position);
      
      //   // Run update inside of Angular's zone
      //   this.zone.run(() => {
      //     this.lat = position.coords.latitude;
      //     this.lng = position.coords.longitude;
      //     this.logs.push(`${position.coords.latitude},${position.coords.longitude}`);
      //   });
      
      // });

  

// Checks if position detection is enabled on the device. Otherwise, it launches the native option to enable it.
    }

startTracking() {
  console.log("Am intrant in startTracking din service")
    this.platform.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      // Platform now ready, execute any required native code.
      if (readySource == "cordova") {
        this.backgroundGeolocation.checkStatus()
        .then((rta) =>{
          if(rta){
            this.startBackgroundGeolocation();
          } else {
            this.backgroundGeolocation.showLocationSettings();
          }
        })
      }
      // else if (readySource == "dom") {
      //   this.presentAlert();
      // }
    });
  }
    
  async stopTracking(title: string){
    console.log('stopTracking');
    
    this.platform.ready().then(async (readySource) => {
      console.log('Platform ready from', readySource);
      // Platform now ready, execute any required native code.
      if (readySource == "cordova") {
        this.backgroundGeolocation.stop();
        // this.backgroundGeolocation.configure(this.config).unsubscribe();
      }
      // else if (readySource == "dom") {
      //     this.presentAlert();
      // }
    });
    const gpx = await this.generateGPX(this.logs, title);
    return gpx;
    //  if (typeof this.watch != "undefined") this.watch.unsubscribe();
  }

  async generateGPX(data: any[], title: string): Promise<string>{
    const gpxStart =
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
      '<gpx version="1.1" creator="MapRecorder">\n' +
      '  <rte>\n' +
      `<name>${title}</name>`;
    const gpxEnd = ' </rte>\n' + '</gpx>';

    const gpxTrackpoints = data
      .map(
        (point) =>
          `<rtept lat="${point.lat}" lon="${point.lon}"><time>${point.time}</time><ele>${point.alt}</ele></rtept>`
      )
      .join('\n');

    return gpxStart + gpxTrackpoints + gpxEnd;
  }

  getRecordedData(){
    return this.logs;
  }

  // presentAlert() {
  //   let alert = this.alertCtrl.create({
  //     title: 'Error Cordova',
  //     subTitle: 'To test the application use a mobile device.',
  //     buttons: ['OK']
  //   });
  //   alert.present();
  // }

}

