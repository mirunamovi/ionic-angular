import { Component, AfterViewInit, OnInit } from '@angular/core';
// import * as L from 'leaflet';
import 'leaflet-omnivore'; 
import { AlertController } from '@ionic/angular';
import { MapService } from '../activity-list/services/map.service';
import { HttpClient } from '@angular/common/http';
import { MapRecorderService } from './map-recorder.service';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { IonicSlides, Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';


declare const L: any;

@Component({
  selector: 'app-map-recorder',
  templateUrl: './map-recorder.component.html',
  styleUrls: ['./map-recorder.component.css'],
})
export class MapRecorderComponent implements OnInit {

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

  constructor(private alertController: AlertController, private http: HttpClient, private mapRecorderService: MapRecorderService) {}

  ngOnInit(): void {

      // this.map = L.map('map').fitWorld();
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   attribution: 'contributor',
      //   maxZoom: 30
      // }).addTo(this.map);

      // this.geolocation.getCurrentPosition().then((resp: { coords: { latitude: any; longitude: any; }; }) => {
      //     console.log('Platform is android/ios')
      //     this.setMarkertWithAnimation(resp.coords.latitude, resp.coords.longitude)  
      //   }).catch((error) => {
      //     console.log('Error getting location', error);
      //   });
    
      this.initMap();
      this.initMapRecorder();
      this.getLocation();

  }
  

//   setMarkertWithAnimation(lat: any, lng: any) {
//      {
//       this.marker = L.marker([lat, lng]).on('click', () => {
//         console.log('marker clicked');
         
//       });
//       this.map.addLayer(this.marker);
//       this.map.setView({lat, lng}, this.map.getZoom() ,{
//         "animate": true,
//         "pan": {
//           "duration": 4
//         }
//       })
//       this.http.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`).subscribe((data: any) => {
//         console.log('Address Data',data)

//       })
//     }
//     setTimeout(() => 
//     { this.map.invalidateSize()}, 500 );

//   }

//   setGeoLocation(position: { coords: { latitude: any; longitude: any } }) {
//     const {
//        coords: { latitude, longitude },
//     } = position;
 
//     const  map = L.map('map').setView([latitude, longitude], 3);
 
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors'
//      } ).addTo(map);
//  }
async getLocation() {
  const position = await Geolocation.getCurrentPosition();
  this.latitude = position.coords.latitude;
  this.longitude = position.coords.longitude;
  this.altitude = position.coords.altitude;

}

  initMap(): void {
    this.map = L.map('map', {
      center: [43.00, -79.00],
      zoom: 15
    }).fitWorld();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    setTimeout( () => { this.map.invalidateSize() }, 800);

    this.map.locate({
      watch: true, // Continuously update the user's location
      setView: true, // Set the map view to the user's location
      maxZoom: 16, // Maximum zoom level
      enableHighAccuracy: true // Use high accuracy mode if available
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
    if (this.recording) {
      this.recordedData.push({ lat: e.latitude, lon: e.longitude, time: new Date().toISOString() });
    }
    L.circle(e.latitude, e.longitude).addTo(this.map);
  }

  // Save recorded data to a GPX file
  saveGPX(): void {
    const gpxData = this.generateGPX(this.recordedData);
    this.recording = false;
    this.pause = false;
    this.map.stopLocate();
    // const title = this.fileName;
    this.recordedData = []; // Clear existing data

    // const blob = new Blob([gpxData], { type: 'text/xml' });
    // const a = document.createElement('a');
    // a.href = URL.createObjectURL(blob);
    // a.download = `'${title}.gpx'`;
    // a.click();
    // this.mapRecorderService.createTracks({title});

    // Create a Blob from the GPX data
    // const blob = new Blob([gpxData], { type: 'text/xml' });

    // // Create a File object
    // const file = new File([blob], `${this.fileName}.gpx`);
    // this.http.post('../../assets/gpx/', file).subscribe({
    //   next: response => {
    //     console.log('File saved successfully:', response);
    //   },
    //   error: error => {
    //     console.error('Error saving file:', error);
    //   }
    // });
  }

  private generateGPX(data: any[]): string {
    const gpxStart = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
                    '<gpx version="1.1" creator="MapRecorder">\n' +
                    '  <rte>\n' +
                    '<name>${fileName}</name>';
    const gpxEnd = ' </rte>\n' +
                    '</gpx>';

    const gpxTrackpoints = data.map(point => `<rtept lat="${point.lat}" lon="${point.lon}"><time>${point.time}</time></rtept>`).join('\n');

    return gpxStart + gpxTrackpoints + gpxEnd;
  }

  async startRecording(): Promise<void> {
    // Create an alert dialog
    const alert = await this.alertController.create({
        header: 'GPX File Name',
        inputs: [
            {
                name: 'fileName',
                type: 'text',
                placeholder: 'Enter GPX file name'
            }
        ],
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel'
            },
            {
                text: 'Start Recording',
                handler: (data) => {
                  // this.mapRecorderService.createTracks();
                    // Handler function to execute when the "Start Recording" button is clicked
                    this.fileName = data.fileName.trim();
                      const title = this.fileName;

                    this.mapRecorderService.createTracks({title}).subscribe();
                    
                    console.log(title);
                    if (this.fileName !== '') {
                        // Proceed with recording
                        this.recording = true;
                        this.recordedData = []; // Clear existing data
                        this.polyline.setLatLngs([]); // Clear existing polyline
                        this.map.locate({ watch: true, setView: true, enableHighAccuracy: true });

                    } else {
                        // Show an alert if no file name is provided
                        this.showFileNameAlert();
                    }
                }
            }
        ]
    });

    // Present the alert dialog
    await alert.present();
}



async showFileNameAlert(): Promise<void> {
    const alert = await this.alertController.create({
        header: 'Invalid File Name',
        message: 'Please enter a valid file name.',
        buttons: ['OK']
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
