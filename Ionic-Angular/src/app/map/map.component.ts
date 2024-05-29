import { Component, OnInit } from '@angular/core';
import { MapService } from '../activity-list/services/map.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Track } from '../ts/interfaces/track';
import { Observable, firstValueFrom } from 'rxjs';

declare const omnivore: any;

declare const L: any;


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  gpxUrl: string = ''; // Example GPX URL
  mapId: string = 'map';

  // trackId = "6648e64d2041195d0366ae2c";
 trackId: string| null = null;
  gpxData: any;
  url = 'http://192.168.0.109:4000/tracks/'
  // url = 'http://192.168.46.213:4000/tracks/'
  // url = 'http://localhost:4000/tracks/'


  
  constructor(private http: HttpClient,
              private route: ActivatedRoute) { }

  activity?: Track;
  activityName?: string;
  activityComments?: string;
  activityDate?: Date;
  activityDistance?: number;

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.trackId = params.get('trackId');
      console.log('Track ID in Map Component:', this.trackId);

      if (this.trackId) {
        this.getActivity(this.trackId);
      }
    });
  }

  getTrack(trackId: string | null): Observable<Track> {
    return this.http.get<Track>(`${this.url}${trackId}`);
  }

  getActivity(trackId: string) {
    this.getTrack(trackId).subscribe({
      next: (track) => {
        if (!track) {
          console.error('Track data is null or undefined');
          return;
        }
        this.activity = track;
        this.activityName = this.activity.title;
        this.activityDate = this.activity.createdAt;
        // this.gpxUrl = this.gpxUrl + this.activityName + ".gpx";


        // const url = track.url;
        // console.log(url);
        // if (!url) {
        //   console.error('Track URL is null or undefined');
        //   return;
        // }

        // this.http.get(url, { responseType: 'blob' }).subscribe({
        //   next: (data) => {
        //     console.log('Track data received:', data);
        //     this.gpxData = data;
        //     this.initMap(); // Initialize the map after setting gpxData
        //   },
        //   error: (error) => {
        //     console.error('Error fetching track data:', error);
        //   }
        // });
      },
      error: (error) => {
        console.error('Error fetching track details:', error);
      }
    });
  }



  // async ngOnInit() {

    // this.route.paramMap.subscribe(params => {
    //   this.trackId = params.get('trackId');
    //   console.log("Received trackId:", this.trackId);
    // });
    // this.trackId = this.route.snapshot.paramMap.get('trackId')
    // this.route.paramMap.subscribe(params => {
    //   this.trackId = params.get('trackId');
    //   console.log("Received trackId:", this.trackId);
    // });

    // this.activity = this.getTrack(this.trackId);
    // console.log(this.activity);
    // this.loadTrackData(this.activity.trackId);

    // this.activity = this.getTrack(this.trackId);
    // this.initMap();

    // this.activityName = this.activity.title;
    // this.activityComments = this.activity.comments;
    // this.activityDistance = this.activity.distance;
    // this.activityDate = this.activity.createdAt;
    // this.gpxData = this.activity.url;
  
  


  // initMap(): void {
  //   let myStyle = {
  //     "color": "#8209d9",
  //     "weight": 5,
  //     "opacity": 0.95
  //   };

  //   let map = new L.Map('map', {
  //     center: [43.0, -79.0],
  //     zoom: 15,
  //   });
  //   // L.control.fullscreen().addTo(this.map);

  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '© OpenStreetMap contributors',
  //   }).addTo(map);

  //   setTimeout(() => {
  //     map.invalidateSize();
  //   }, 800);

  //   if (this.activity) {
  //     var customLayer = L.geoJson(null, {
  //       pointToLayer: function () {
  //         return null; 
  //       },
  //       style: myStyle
  //     });

      // let gpxLayer = omnivore.gpx(this.activity.gpxData, null, customLayer)
      //   .on('ready', function () {
      //     map.fitBounds(gpxLayer.getBounds());
      //   }).addTo(map);
      //   console.log(this.activity.gpxData);

  //     if (this.gpxData) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         omnivore.gpx(e.target.result, null, customLayer).addTo(map);
  //       };
  //       reader.readAsText(this.gpxData);
  //     } else {
  //       console.error('GPX data is undefined');
  //     }
  //   } else {
  //     console.error(`Activity with this ID not found.`);
  //   }

    
  // }


  // getTrackFile(url: string): Promise<Blob> {
  //   return firstValueFrom(this.http.get(url, { responseType: 'blob' }));
  // }

  // async loadTrackData(trackId: string | null) {
  //   if (trackId) {
  //     try {
  //       const track = await this.getTrack(trackId);
  //       console.log('Track details:', track);
  //       const gpxBlob = await this.getTrackFile(track.url);
  //       console.log('Track file received:', gpxBlob);
  //       this.gpxData = gpxBlob;
  //       this.initMap();
  //     } catch (error) {
  //       console.error('Error fetching track data:', error);
  //     }
  //   } else {
  //     console.log('Invalid trackId');
  //   }
  // }
}
