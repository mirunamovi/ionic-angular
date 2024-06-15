import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import 'leaflet-gpx';
import { MapService } from '../map/map.service';
import Chart from 'chart.js/auto';
import 'leaflet-fullscreen';
import 'leaflet-simple-map-screenshoter';
import { parseString } from 'xml2js';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import { HttpClient } from '@angular/common/http';

declare let L: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements AfterViewInit {
  @Input() gpxUrl!: string;
  @Input() mapId!: string;

  @Output() distanceChange = new EventEmitter<any>();
  @Output() durationChange = new EventEmitter<any>();
  @Output() speedChange = new EventEmitter<any>();
  
  distance!: any;
  duration!: any;
  speed!: any;

  simpleMapScreenshoter:any;
  screenName:any;
  isToastOpen: boolean = false;
  toastMessage = 'Welcome to PeakGeek';
  @Input() activityFileName?: string;
  @Input() activityTitle?: string;
  @Input() activityThumbnail?: string;

  title: string = '';
  fileName: string = '';
  thumbnail : string | undefined = '';

  constructor(private mapService: MapService, private http: HttpClient) {}
  ngOnInit(): void {
    // Initialize title and fileName here
    if (this.activityTitle && this.activityFileName) {
      this.title = this.activityTitle;
      this.fileName = this.activityFileName;
      this.thumbnail = this.activityThumbnail;
    }
  }

  ngAfterViewInit(): void {
    this.displayGpx();
  }

  displayGpx() {
    console.log('gpxUrl in mapview ' + this.gpxUrl + ' ' + this.mapId);

    if (!this.gpxUrl || !this.mapId) return;

    const map = L.map(this.mapId).setView([45.505, 25.02], 10); // Set a default view if necessary
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>',
    }).addTo(map);

    map.addControl(
      new L.Control.Fullscreen({
        position: 'topleft',
        title: 'Show me the fullscreen!',
        titleCancel: 'Exit fullscreen mode',
        forceSeparateButton: true,
      })
    );

    const control = L.control.layers({}, {}).addTo(map); // Use empty objects instead of null
    this.screenName = "Thumbnail-" +  this.activityFileName;

    this.simpleMapScreenshoter = L.simpleMapScreenshoter({screenName: this.screenName}).addTo(map);
    
    this.mapService.getGpxFile(this.gpxUrl).subscribe((gpxData: string) => {
      const gpx = new L.GPX(gpxData, {
        async: true,
        marker_options: {
          startIconUrl: 'assets/pin-icon-start.png',
          endIconUrl: 'assets/pin-icon-end.png',
          shadowUrl: 'assets/pin-shadow.png',
        },
      })
        .on('loaded', (e: any) => {
          const gpx = e.target;
          map.fitBounds(gpx.getBounds());
          control.addOverlay(gpx, gpx.get_name());
          this.distance = gpx.get_distance_imp().toFixed(2);
          this.duration = gpx.get_duration_string(gpx.get_moving_time());
          this.speed = gpx.get_total_speed().toFixed(2);;
          console.log(" this.speed: " +  this.speed);
          this.distanceChange.emit(this.distance);
          this.durationChange.emit(this.duration);
          this.speedChange.emit(this.speed);

          this.parseAndCreateChart(gpx._gpx);
          console.log("this.fileName: " + this.fileName);
          if(this.activityThumbnail === ''){
            this.attachScreenshotListener();
          }

        })
        .addTo(map);
    });
  }

  attachScreenshotListener() {
    if (!this.simpleMapScreenshoter) {
      console.error('SimpleMapScreenshoter plugin is not initialized.');
      return;
    }

    // Listen for the screenshot event
      this.simpleMapScreenshoter.takeScreen('blob').then((res: BlobPart) => {
        const blob = new Blob([res], { type: 'image/png' });
  
        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('fileName', this.fileName);
        formData.append('file', blob, `${this.screenName}.png`);
  
        this.http.post('http://mimovi.go.ro:4000/tracks/upload', formData).subscribe(
          (res) => {
            console.log(res);
            this.setOpen(true);
            this.toastMessage = 'Uploaded Thumbnail Successfully.';
          },
          (error) => {
            console.error('Error uploading thumbnail:', error);
          }
        );
      });
  }

  // takeScreenshotAndUpload(): void {
  //   if (!this.simpleMapScreenshoter || !this.title || !this.fileName) {
  //     console.error('Missing required data for screenshot and upload.');
  //     return;
  //   }

  //   this.simpleMapScreenshoter.takeScreen('blob').then((res: BlobPart) => {
  //     const blob = new Blob([res], { type: 'image/png' });

  //     const formData = new FormData();
  //     formData.append('title', this.title);
  //     formData.append('fileName', this.fileName);
  //     formData.append('file', blob, `${this.screenName}.png`);

  //     this.http.post('http://mimovi.go.ro:4000/tracks/upload', formData).subscribe(
  //       (res) => {
  //         console.log(res);
  //         this.setOpen(true);
  //         this.toastMessage = 'Uploaded Thumbnail Successfully.';
  //       },
  //       (error) => {
  //         console.error('Error uploading thumbnail:', error);
  //       }
  //     );
  //   });
  // }


  haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  calculateCumulativeDistances(data: any[]): number[] {
    let cumulativeDistance = 0;
    const cumulativeDistances: number[] = [];

    for (let i = 1; i < data.length; i++) {
      const distance = this.haversineDistance(
        data[i - 1].lat,
        data[i - 1].lon,
        data[i].lat,
        data[i].lon
      );
      cumulativeDistance += distance;
      cumulativeDistances.push(cumulativeDistance);
    }

    return cumulativeDistances;
  }

  parseAndCreateChart(gpxData: string): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxData, 'text/xml');

    const routePoints = xmlDoc.querySelectorAll('rtept');
    const data = Array.from(routePoints).map((point: Element) => {
      const lat = parseFloat(point.getAttribute('lat') || '0');
      const lon = parseFloat(point.getAttribute('lon') || '0');
      let ele = null;
      let time = null;

      const eleElement = point.querySelector('ele');
      if (eleElement) {
        ele = parseFloat(eleElement.textContent || '0');
      }

      const timeElement = point.querySelector('time');
      if (timeElement) {
        time = timeElement.textContent || '';
      }

      return {
        lat: lat,
        lon: lon,
        ele: ele,
        time: time,
      };
    });
    const cumulativeDistances = this.calculateCumulativeDistances(data);
    this.createChart(data, cumulativeDistances);
  }

  createChart(data: any[], distances: any[]): void {
    const ctx = document.getElementById('elevationChart') as HTMLCanvasElement;
    const elevations = data.map((pt) => pt.ele);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: distances,
        datasets: [
          {
            label: 'Elevation (m)',
            data: elevations,
            borderColor: 'green',
            // borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 0.5,
            pointRadius: 1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false, // Allow the aspect ratio to change
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Cumulative Distance (km)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Elevation (m)',
            },
          },
        },
      },
    });
  }


  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
