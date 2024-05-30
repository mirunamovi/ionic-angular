import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import 'leaflet-gpx';
import { MapViewService } from '../map/map.service';
declare let L: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  @Input() gpxUrl!: string;
  @Input() mapId!: string;

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

    const control = L.control.layers({}, {}).addTo(map); // Use empty objects instead of null

    this.mapViewService.getGpxFile(this.gpxUrl).subscribe((gpxData: string) => {
      const gpx = new L.GPX(gpxData, {
        async: true,
        marker_options: {
          startIconUrl: 'assets/pin-icon-start.png',
          endIconUrl: 'assets/pin-icon-end.png',
          shadowUrl: 'assets/pin-shadow.png',
        },
      }).on('loaded', function(e: any) {
        const gpx = e.target;
        map.fitBounds(gpx.getBounds());
        control.addOverlay(gpx, gpx.get_name());
      }).addTo(map);

      L.control.fullscreen().addTo(map);

    });
  }
}
