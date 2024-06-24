import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
// import * as L from 'leaflet';
import { AlertController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { MapRecorderService } from './map-recorder.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { File } from '@ionic-native/file/ngx';
import { LocationTracker } from './bglocation-capacitor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NetworkAwareHandler } from '../NetworkAware/NetworkAware.directive';
import {
  ConnectionStatus,
  NetworkService,
} from '../NetworkAware/network.service';
import 'leaflet-fullscreen';
import { Router } from '@angular/router';
import {v4 as uuidv} from 'uuid';


declare const L: any;

@Component({
  selector: 'app-map-recorder',
  templateUrl: './map-recorder.component.html',
  styleUrls: ['./map-recorder.component.css'],
})
export class MapRecorderComponent extends NetworkAwareHandler {
  protected override onNetworkStatusChange(status: ConnectionStatus) {
    if (status === ConnectionStatus.Offline) {
      this.handleOfflineStatus();
    } else {
      this.handleOnlineStatus();
    }
  }

  private handleOfflineStatus() {
    // Handle offline status
    console.log('Network is offline. Taking appropriate actions.');
    // Add your logic here
  }

  private handleOnlineStatus() {
    // Handle online status
    console.log('Network is online. Taking appropriate actions.');
    // Add your logic here
  }


  map: any;
  polyline: any;
  marker: any;
  recordedData: any[] = [];
  recording: boolean = false;
  pause: boolean = false;
  fileName: string = '';
  latitude?: number;
  longitude?: number;
  altitude?: number | null;
  speed? : number | null;
  showSaveButton: boolean = false;

  url = 'http://mimovi.go.ro:4000/uploads/';
  // url = 'http://192.168.0.106:4000/uploads/'
  // url = 'http://localhost:4000/tracks/'

  private destroyed = false;
  private watchId: string | undefined;
  locationTracker = new LocationTracker();
  isToastOpen: boolean = false;
  toastMessage = 'Welcome to PeakGeek';

  uploadFormGroup: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
  });

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
    private file: File,
    networkService: NetworkService,
    public platform: Platform,
    private router: Router

  ) {
    super(networkService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.initMap();
    this.initMapRecorder();
    this.getLocation();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    console.log('ngOnDestroy is called');
    this.destroyed = true;
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }

  async getLocation() {
    const options: PositionOptions = {
      timeout: 5000,
      enableHighAccuracy: true,
    };
    Geolocation.watchPosition(
      options,
      (position: Position | null, error?: GeolocationPositionError) => {
        if (!this.destroyed && !error && position !== null) {
          (this.latitude = position.coords.latitude),
            (this.longitude = position.coords.longitude),
            (this.altitude = position.coords.altitude !== null ? Math.round(position.coords.altitude * 10) / 10 : 0.0),
            (this.speed = position.coords.speed !== null ? Math.round(position.coords.speed * 3.6 * 10) / 10 : 0.0),
            console.log(
              'New location received:',
              position.coords.latitude,
              position.coords.longitude
            );
        }
      }
    )
      .then((watchId) => {
        this.watchId = watchId;
      })
      .catch((error) => {
        console.error('Error starting geolocation watch:', error);
      });
  }

  initMap(): void {
    this.map = new L.Map('map', {
      center: [43.0, 22.0],
      zoom: 15,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>',
    }).addTo(this.map);

    this.map.whenReady(() => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 1000);
    });

    this.map.addControl(new L.Control.Fullscreen({
      position: 'topleft',
      title: 'Show me the fullscreen!',
      titleCancel: 'Exit fullscreen mode',
      forceSeparateButton: true
    }));

    this.map.locate({
      watch: true, // Continuously update the user's location
      setView: true, // Set the map view to the user's location
      maxZoom: 16, // Maximum zoom level
      enableHighAccuracy: true, // Use high accuracy mode if available
    });
  }

  initMapRecorder(): void {
    console.log('Am intrat in initmaprecorder');
    this.polyline = L.polyline([], { color: 'blue' }).addTo(this.map);
    this.marker = L.marker([0, 0], { icon: this.customIcon }).addTo(this.map);

    this.map.on('locationfound', (e: any) => this.onLocationFound(e));
  }

  private customIcon = L.icon({
    iconUrl: 'assets/icon/marker-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  private onLocationFound(e: any): void {
    const currentLocation = [e.latitude, e.longitude];

    // Update the marker position
    this.marker.setLatLng(currentLocation);

    // Update the polyline with the new location
    this.polyline.addLatLng(currentLocation);

    L.circle(e.latitude, e.longitude).addTo(this.map);
  }

  async saveGPX() {
    this.showSaveButton = false;
    this.recording = false;
    this.pause = false;
    this.map.stopLocate();

    this.clearMap();
    const folderName = 'PeakGeek';
    const title = this.fileName;
    console.log("filename inainte de  join: "+ this.fileName);

    const uniqueSuffix = uuidv();
    const fileName = this.fileName.split(' ').join('') + '_' + uniqueSuffix;

    console.log("title: " + title);
    console.log("filename dupa join: "+ fileName);

    const gpxData = await this.locationTracker.stopTracking();
    const blob = new Blob([gpxData], { type: 'application/gpx' }); // Assuming gpxContent is a string containing GPX data

    if (this.currentStatus === ConnectionStatus.Offline) {
      this.setOpen(true);
      this.toastMessage = 'No Internet Connection. The Track will be saved in your filesystem.';

      const filePath = this.file.externalRootDirectory + "/Download/"+ folderName + '/'; // Add folder name to the path
    //const filePath = this.file.externalRootDirectory + "/Download/"; 

      this.file
        .checkDir(this.file.externalRootDirectory + "/Download/", folderName)
        .then((_) => {
          console.log('Directory exists.');
          // Proceed with saving the file
        })
        .catch((err) => {
          this.setOpen(true);
          this.toastMessage = 'Directory created.';
          // Create the directory
          this.file
            .createDir(this.file.externalRootDirectory + "/Download/", folderName, false)
            .then((_) => {
              this.setOpen(true);
              this.toastMessage = 'Directory created.';
              // Proceed with saving the file
            })
            .catch((err) => {
              console.error('Error creating directory:', err);
            });
        });

      this.file
        .writeFile(filePath, `${fileName}.gpx`, blob, { replace: true })
        .then((_) => {
          console.log('GPX file saved successfully.');
          this.setOpen(true);
          this.toastMessage = 'GPX file saved successfully.';
        }
        )
        .catch((err) => console.error('Error saving GPX file:', err));

    } else {

      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', blob, `${fileName}.gpx`);
      formData.append('fileName',  `${fileName}.gpx`);

      this.http
            .post('http://mimovi.go.ro:4000/tracks/upload', formData)
    //        .post('http://192.168.0.106:4000/tracks/upload', formData)
    //        .post('BACKEND_URI/tracks/upload', formData)
            .subscribe((res) => {
              console.log(res);
              this.setOpen(true);
              this.toastMessage = 'Uploaded Successfully.';
            });
        }
    //   this.http
    //     .post('http://192.168.0.109:4000/tracks/upload', formData)
    //     .subscribe((res) => {
    //       console.log(res);
    //       this.setOpen(true);
    //       this.toastMessage = 'Uploaded Successfully.';
    //     });
    // }
  }
  

  async startRecording(): Promise<void> {
    // Create an alert dialog
    const alert = await this.alertController.create({
      header: 'GPX File Name',
      inputs: [
        {
          name: 'fileName',
          type: 'text',
          placeholder: 'Enter GPX file name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Start Recording',
          handler: (data) => {
            // Handler function to execute when the "Start Recording" button is clicked
            this.fileName = data.fileName.trim();
            if (this.fileName !== '') {
              // Proceed with recording
              this.recording = true;
              // this.recordedData = []; // Clear existing data
              this.locationTracker.startTracking();
              this.showSaveButton = true;

              this.polyline.setLatLngs([]); // Clear existing polyline
              this.map.locate({
                watch: true,
                setView: true,
                enableHighAccuracy: true,
              });
            } else {
              // Show an alert if no file name is provided
              this.showFileNameAlert();
            }
          },
        },
      ],
    });

    // Present the alert dialog
    await alert.present();
  }

  async showFileNameAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Invalid File Name',
      message: 'Please enter a valid file name.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  pauseRecording(): void {
    this.recording = false;
    this.pause = true;
    this.map.stopLocate();
  }

  resumeRecording(): void {
    this.recording = true;
    this.pause = false;
    this.map.locate({ watch: true, setView: true });
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  clearMap(): void {
    // Remove marker
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Remove polyline
    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }
  }
    async exitMapRecording(): Promise<void> {
      console.log("am intrat in exit");
      if (this.recording  || (this.recording === false && this.pause === true)){
          const alert = this.alertController.create({
            header: 'Track Termination',
            message: 'Do you want to close this Page without saving the Track?',
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Application exit prevented!');
                }
            },{
              text: 'Save Track',
              handler: async () => {
                  await this.saveGPX()
                  if (this.platform.is('android')) {
                    this.router.navigate(['/home']);
                  } else {
                      console.log('Exit app'); // Handle app closing for non-Cordova platforms
                  }
              }
            },
            {
              text: 'Don\'t Save Track',
              handler: async () => {
                  if (this.platform.is('android')) {
                    this.router.navigate(['/home']);
                  } else {
                      console.log('Exit app'); // Handle app closing for non-Cordova platforms
                  }
              }
            }
          ]
          });
          await (await alert).present();
      }
      else{
          this.router.navigate(['/home']);
         }
        }







}