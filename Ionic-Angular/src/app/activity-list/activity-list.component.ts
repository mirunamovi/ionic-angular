import { Component, OnInit } from '@angular/core';
import { IActivity } from '../shared/activity.model';
import { ActivityService } from './services/activity.service';
import { ActivityListService } from './activity-list.service';
import { TrackInterface } from '../ts/interfaces/track';
import { IRun } from '../shared/run.model';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  activities?: IActivity[];
  totalActivities?: number;
  totalDistance?: number;
  firstDate?: Date;
  runs?: IRun[];

  constructor(private _activityService: ActivityService, private activityListService: ActivityListService) { }

  ngOnInit() {
    this.activities = this._activityService.getActivities();
    this.totalActivities = this._activityService.getTotalActivities(this.activities);
    this.totalDistance = this._activityService.getTotalDistance(this.activities);
    this.firstDate = this._activityService.getFirstDate(this.activities);

    this.activityListService.getTracks().subscribe(
      (data: any ) => this.runs = data
    );
  }

  
  
  
}