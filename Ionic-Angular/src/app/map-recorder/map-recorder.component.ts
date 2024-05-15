import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
// import * as L from 'leaflet';
import 'leaflet-omnivore';
import { AlertController } from '@ionic/angular';
import { MapService } from '../activity-list/services/map.service';
import { HttpClient } from '@angular/common/http';
import { MapRecorderService } from './map-recorder.service';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { IonicSlides, Platform } from '@ionic/angular';
import { Geolocation, GeolocationOptions, Position } from '@capacitor/geolocation';
import { File } from '@ionic-native/file/ngx';
import { BackgroundGeolocationService } from './background-geolocation.service';
import { LocationTracker } from './bglocation-capacitor';

declare const L: any;

@Component({
  selector: 'app-map-recorder',
  templateUrl: './map-recorder.component.html',
  styleUrls: ['./map-recorder.component.css'],
})
export class MapRecorderComponent implements OnInit, OnDestroy{
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

  private destroyed = false;
  private watchId: string | undefined;
  locationTracker = new LocationTracker();

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
    private mapRecorderService: MapRecorderService,
    private file: File,
    private backgroundGeolocationService: BackgroundGeolocationService
  ) {}

  ngOnInit(): void {

    this.initMap();
    this.initMapRecorder();
    this.getLocation();
  }

  ngOnDestroy() {
    this.destroyed = true;
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }


  async getLocation() {
    const options: PositionOptions = { timeout: 5000, enableHighAccuracy: true };
    Geolocation.watchPosition(options, (position: Position | null, error?: GeolocationPositionError) => {
      if (!this.destroyed && !error && position !== null) {
          this.latitude = position.coords.latitude,
          this.longitude = position.coords.longitude,
          this.altitude = position.coords.altitude,
          console.log('New location received:', position.coords.latitude, position.coords.longitude);

        };
      }).then(watchId => {
        this.watchId = watchId;
      }).catch(error => {
        console.error('Error starting geolocation watch:', error);
      });
    }


  initMap(): void {
    this.map = L.map('map', {
      center: [43.0, -79.0],
      zoom: 15,
    }).fitWorld();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 800);

    this.map.locate({
      watch: true, // Continuously update the user's location
      setView: true, // Set the map view to the user's location
      maxZoom: 16, // Maximum zoom level
      enableHighAccuracy: true, // Use high accuracy mode if available
    });
  }

  initMapRecorder(): void {
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

    // Add the location data to the recordedData array if recording is active
    // if (this.recording) {
    //   this.recordedData.push({
    //     lat: e.latitude,
    //     lon: e.longitude,
    //     alt: e.altitude,
    //     time: new Date().toISOString(),
    //   });
    // }
    L.circle(e.latitude, e.longitude).addTo(this.map);
  }

  async saveGPX() {
    const folderName = 'PeakGeek';
    const title = this.fileName;

    const gpxData = await this.locationTracker.stopTracking();
  
    // const gpxData =  this.generateGPX(this.recordedData);

    const filePath = this.file.externalDataDirectory + folderName + '/'; // Add folder name to the path

    this.file
      .checkDir(this.file.externalDataDirectory, folderName)
      .then((_) => {
        console.log('Directory exists.');
        // Proceed with saving the file
      })
      .catch((err) => {
        console.log('Directory does not exist. Creating...');
        // Create the directory
        this.file
          .createDir(this.file.externalDataDirectory, folderName, false)
          .then((_) => {
            console.log('Directory created.');
            // Proceed with saving the file
          })
          .catch((err) => {
            console.error('Error creating directory:', err);
          });
      });

    const blob = new Blob([gpxData], { type: 'application/gpx+xml' }); // Assuming gpxContent is a string containing GPX data

    this.file
      .writeFile(filePath, title, blob, { replace: true })
      .then((_) => console.log('GPX file saved successfully.'))
      .catch((err) => console.error('Error saving GPX file:', err));

    // this.recording = false;
    this.pause = false;
    this.map.stopLocate();
    // this.recordedData = [];
    this.mapRecorderService.createTracks({ title }).subscribe();
  }

  // private generateGPX(data: any[]): string {
  //   const gpxStart =
  //     '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
  //     '<gpx version="1.1" creator="MapRecorder">\n' +
  //     '  <rte>\n' +
  //     `<name>${this.fileName}</name>`;
  //   const gpxEnd = ' </rte>\n' + '</gpx>';

  //   const gpxTrackpoints = data
  //     .map(
  //       (point) =>
  //         `<rtept lat="${point.lat}" lon="${point.lon}"><time>${point.time}</time><ele>${point.alt}</ele></rtept>`
  //     )
  //     .join('\n');

  //   return gpxStart + gpxTrackpoints + gpxEnd;
  // }

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

  // stopRecording(): void {
  //   this.recording = false;
  //   this.map.stopLocate();
  // }

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
}
