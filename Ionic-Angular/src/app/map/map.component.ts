import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Track } from '../ts/interfaces/track';
import { Observable} from 'rxjs';
import { File } from '@ionic-native/file/ngx';
import { MapService } from './map.service';
import { AlertController, Platform } from '@ionic/angular';

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

  isToastOpen: boolean = false;
  toastMessage = 'Welcome to PeakGeek';

  @Output() distance: any;
  @Output() duration: any;
  @Output() speed: any;

  activityThumbnail: any;

  constructor(public platform: Platform, 
              public alertCtrl: AlertController,
              private route: ActivatedRoute, 
              private file: File,
              private mapService: MapService,
              private router: Router) { }

  activity?: Track;
  activityTitle?: string;
  activityFileName?: string;
  trimFileName?: string;
  activityComments?: string;
  activityDate?: Date;

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

  onSpeedChange(newSpeed: any) {
    this.speed = newSpeed;
    console.log('Speed:', this.speed);
  }

  async getActivity(trackId: string) {
    this.mapService.getTrack(trackId, this.url).subscribe({
      next: (track) => {
        if (!track) {
          console.error('Track data is null or undefined');
          return;
        }
        console.log("am intrat in getActivity");
        this.activity = track;

        this.activityTitle = this.activity.title;
        console.log(" this.activityTitle: " + this.activityTitle)
        this.activityFileName = this.activity.fileName;
        if(this.activityFileName.length > 40){
          this.trimFileName = this.activityFileName.slice(0, -41) + ".gpx";
        }
        else {
          this.trimFileName = this.activityFileName;
        }
        console.log("  this.activityFileName: " +  this.activityFileName)

        this.activityDate = this.activity.createdAt;
        this.activityThumbnail = this.activity.thumbnail;
        this.gpxUrl = "http://mimovi.go.ro:4000/uploads/" + this.activityFileName;
        // this.gpxUrl = "http://192.168.0.109:4000/uploads/" + this.activityFileName;

        
        console.log("gpxUrl in map component " + this.gpxUrl);
      },
      error: (error) => {
        console.error('Error fetching track details:', error);
      }
    });
  }

  async deleteRecording(): Promise<void> {
    this.mapService.deleteTrackfromDb(this.trackId, this.url).subscribe((res) => {
      this.router.navigate(['/home']);
      this.mapService.deleteTrackfromStorage(this.activityFileName).subscribe();
      this.setOpen(true);
      this.toastMessage = 'Delete Successfully.';
    });
    
  }


  

  downloadGPX() {
    if (this.platform.is('cordova')) {
      this.downloadGPXForMobile();
    } else {
      this.downloadGPXForDesktop();
    }
  }

  downloadGPXForMobile() {
    const folderName = 'PeakGeek';
    const downloadPath = this.file.externalRootDirectory + "/Download/";
    const filePath = downloadPath + folderName + '/';

    this.file.checkDir(downloadPath, folderName).catch(() => {
      return this.file.createDir(downloadPath, folderName, false);
    }).then(() => {
      this.mapService.getGpxFileBlob(this.gpxUrl).subscribe(blob => {
        this.file.writeFile(filePath, `${this.activityTitle}.gpx`, blob, { replace: true })
          .then(() => {
            console.log('GPX file saved successfully.');
            this.setOpen(true);
            this.toastMessage = 'GPX file saved successfully.';
          })
          .catch(err => {
            console.error('Error saving GPX file:', err);
          });
      });
    }).catch(err => {
      console.error('Error creating directory:', err);
    });
  }

  downloadGPXForDesktop() {
    this.mapService.getGpxFileBlob(this.gpxUrl).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.activityTitle}.gpx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      this.setOpen(true);
      this.toastMessage = 'GPX file downloaded successfully.';
    }, err => {
      console.error('Error downloading GPX file:', err);
    });
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

}
