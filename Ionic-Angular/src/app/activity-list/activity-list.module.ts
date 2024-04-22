import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityListRoutingModule } from './activity-list-routing.module';
import { ActivityListComponent } from './activity-list.component';
import { MapComponent } from '../map/map.component';
import { MapService } from './services/map.service';
import { ActivityService } from './services/activity.service';
import { IonicModule } from '@ionic/angular';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ActivityListRoutingModule
  ],
  declarations: [ActivityListComponent, MapComponent],
  providers: [ 
    ActivityService, 
    MapService
  ],
})
export class ActivityListModule { }
