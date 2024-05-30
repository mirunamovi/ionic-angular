import { Component, OnInit } from '@angular/core';
import { ActivityListService } from './activity-list.service';
import { Track} from '../ts/interfaces/track';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  activities?: Track[];


  constructor(private activityListService: ActivityListService, private router: Router) { }

 async ngOnInit() {

    this.activityListService.getTracks().subscribe(
      (data: Track[] ) => this.activities = data
    );

    const ids = this.activities?.map(activity => activity._id);
    console.log(ids); // Log the array of IDs
  }
  

  goToMap(trackId: string){
    console.log("am intrat in gotomap");
    console.log("trackId: " + trackId);
    this.router.navigate(['home', 'activities', 'activity', trackId])
     .then(success => console.log('Navigation success:', success))
     .catch(err => console.error('Navigation error:', err));

  }
  
}