import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-recorder',
  templateUrl: './map-recorder.component.html',
  styleUrls: ['./map-recorder.component.css'],
})
export class MapRecorderComponent implements AfterViewInit {

  private map: any;
  private polyline: any;
  private marker: any;
  recordedData: any[] = [];
  recording: boolean = false;

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
    this.initMapRecorder();
  }

  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private initMapRecorder(): void {
    this.polyline = L.polyline([], { color: 'blue' }).addTo(this.map);
    this.marker = L.marker([0, 0]).addTo(this.map);

    this.map.on('locationfound', (e: any) => this.onLocationFound(e));
  }

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
    const blob = new Blob([gpxData], { type: 'text/xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'route.gpx';
    a.click();
  }

  private generateGPX(data: any[]): string {
    const gpxStart = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
                    '<gpx version="1.1" creator="MapRecorder">\n' +
                    '  <rte>\n' +
                    '<name>{input.title}</name>' +
                    '    <rtept>\n';
    const gpxEnd = '    </rtept>\n' +
                    '  </rte>\n' +
                    '</gpx>';

    const gpxTrackpoints = data.map(point => `<rtept lat="${point.lat}" lon="${point.lon}"><time>${point.time}</time></rtept>`).join('\n');

    return gpxStart + gpxTrackpoints + gpxEnd;
  }

  startRecording(): void {
    this.recording = true;
    this.recordedData = []; // Clear existing data
    this.polyline.setLatLngs([]); // Clear existing polyline
    this.map.locate({ watch: true, setView: true });
  }

  stopRecording(): void {
    this.recording = false;
    this.map.stopLocate();
  }
}
