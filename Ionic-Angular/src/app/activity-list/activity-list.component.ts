import { Component, OnInit } from '@angular/core';
import { ActivityListService } from './activity-list.service';
import { Track} from '../ts/interfaces/track';
import { Router } from '@angular/router';
import { ThumbnailService } from '../thumbnail-viewer/thumbnail.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  activities: Track[] = [];


  constructor(private activityListService: ActivityListService, private router: Router) { }

 async ngOnInit() {
    console.log("ngOnInit in activity list is called");
    this.activityListService.getTracks().subscribe(
      (data: Track[] ) => this.activities = data
    );

    const ids = this.activities?.map(activity => activity._id);

  }

  getThumbnailFilename(activityTitle: string): string | undefined {
    const activity = this.activities?.find(act => act.title === activityTitle);
    return activity ? activity.thumbnail : '';
  }
  

  goToMap(trackId: string){
    console.log("am intrat in gotomap");
    console.log("trackId: " + trackId);
    this.router.navigate(['home', 'activities', 'activity', trackId])
     .then(success => console.log('Navigation success:', success))
     .catch(err => console.error('Navigation error:', err));
  }


  
}