import { Component, OnInit, Output } from '@angular/core';
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

  trackId: string| null = null;
  gpxData: any;
  // url = 'http://192.168.0.109:4000/tracks/'
  // url = 'http://192.168.46.213:4000/tracks/'
  // url = 'http://localhost:4000/tracks/'
  url = 'http://mimovi.go.ro:4000/tracks/';

  @Output() distance: any;
  @Output() duration: any;

  constructor(private http: HttpClient,
              private route: ActivatedRoute) { }

  activity?: Track;
  activityTitle?: string;
  activityFileName?: string;
  activityComments?: string;
  activityDate?: Date;
  // activityDistance?: any;
  // activityDuration?: any;


  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.trackId = params.get('trackId');
      console.log('Track ID in Map Component:', this.trackId);
      console.log("GPXURL inainte de getActivity " + this.gpxUrl);

      if (this.trackId) {
        await this.getActivity(this.trackId);
      }
    });
  }

  onDistanceChange(newDistance: any) {
    this.distance = newDistance;
    console.log('Distance:', this.distance);
  }

  onDurationChange(newDuration: any) {
    this.duration = newDuration;
    console.log('Duration:', this.duration);
  }

  getTrack(trackId: string | null): Observable<Track> {
    return this.http.get<Track>(`${this.url}${trackId}`);
  }

  async getActivity(trackId: string) {
    this.getTrack(trackId).subscribe({
      next: (track) => {
        if (!track) {
          console.error('Track data is null or undefined');
          return;
        }
        console.log("am intrat in getActivity");
        this.activity = track;
        this.activityTitle = this.activity.title;
        this.activityFileName = this.activity.fileName;
        this.activityDate = this.activity.createdAt;
        // this.activityDuration = this.duration;
        // console.log(this.duration);
        // this.activityDistance = this.distance;
        // console.log(this.distance);

        // this.gpxUrl = "http://192.168.0.109:4000/uploads/" + this.activityFileName;
        this.gpxUrl = "http://mimovi.go.ro:4000/uploads/" + this.activityFileName;

        console.log("gpxUrl in map component " + this.gpxUrl);
      },
      error: (error) => {
        console.error('Error fetching track details:', error);
      }
    });
  }
}
