import { Component, AfterViewInit, OnInit } from '@angular/core';
// import * as L from 'leaflet';
import 'leaflet-omnivore'; 
import { AlertController } from '@ionic/angular';
import { MapService } from '../services/map.service';
import { HttpClient } from '@angular/common/http';


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

  constructor(private alertController: AlertController, private mapService: MapService, private http: HttpClient) {}

  ngOnInit(): void {
    this.initMap();
    this.initMapRecorder();
  }

  initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
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
  }

  // Save recorded data to a GPX file
  saveGPX(): void {
    const gpxData = this.generateGPX(this.recordedData);
    this.recording = false;
    this.pause = false;
    this.mapService.createTrack(this.fileName);
    // Create a Blob from the GPX data
    const blob = new Blob([gpxData], { type: 'text/xml' });

    // Create a File object
    const file = new File([blob], `${this.fileName}.gpx`);
    this.http.post('../../assets/gpx/', file).subscribe({
      next: response => {
        console.log('File saved successfully:', response);
      },
      error: error => {
        console.error('Error saving file:', error);
      }
    });
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
                    // Handler function to execute when the "Start Recording" button is clicked
                    this.fileName = data.fileName.trim();
                    if (this.fileName !== '') {
                        // Proceed with recording
                        this.recording = true;
                        this.recordedData = []; // Clear existing data
                        this.polyline.setLatLngs([]); // Clear existing polyline
                        this.map.locate({ watch: true, setView: true });

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

  stopRecording(): void {
    this.recording = false;
    this.map.stopLocate();
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
}
