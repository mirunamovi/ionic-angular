import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import 'leaflet-gpx';
import { MapViewService } from '../map/map.service';
import 'leaflet-fullscreen';

declare let L: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  @Input() gpxUrl!: string;
  @Input() mapId!: string;

  @Output() distanceChange = new EventEmitter<any>();
  @Output() durationChange = new EventEmitter<any>();
  distance!: any;
  duration!: any;

  constructor(private mapViewService: MapViewService) {}

  ngAfterViewInit(): void {
    this.displayGpx();
  }
  displayGpx() {
    console.log("gpxUrl in mapview " + this.gpxUrl + " " + this.mapId);

    if (!this.gpxUrl || !this.mapId) return;

    const map = L.map(this.mapId).setView([45.505, 25.02], 15); // Set a default view if necessary
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
    }).addTo(map);

    map.addControl(new L.Control.Fullscreen({
      position: 'topleft',
      title: 'Show me the fullscreen!',
      titleCancel: 'Exit fullscreen mode',
      forceSeparateButton: true
    }));

    const control = L.control.layers({}, {}).addTo(map); // Use empty objects instead of null

    this.mapViewService.getGpxFile(this.gpxUrl).subscribe((gpxData: string) => {
      const gpx = new L.GPX(gpxData, {
        async: true,
        marker_options: {
          startIconUrl: 'assets/pin-icon-start.png',
          endIconUrl: 'assets/pin-icon-end.png',
          shadowUrl: 'assets/pin-shadow.png',
        },
      }).on('loaded', (e: any) => {
        const gpx = e.target;
        map.fitBounds(gpx.getBounds());
        control.addOverlay(gpx, gpx.get_name());
        this.distance = gpx.get_distance_imp().toFixed(2);
        console.log("distance: " + this.distance);
        this.duration = gpx.get_duration_string(gpx.get_moving_time());
        console.log("duration: " + this.duration);
        this.distanceChange.emit(this.distance);
        this.durationChange.emit(this.duration);
      }).addTo(map);

    });
  }
}
