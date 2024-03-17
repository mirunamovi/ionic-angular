import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MapComponent} from '../map/map.component';
import { ActivityListComponent } from '../activity-list/activity-list.component';

import { HttpClientModule } from '@angular/common/http';
import { ActivityService } from '../services/activity.service';
import { MapService } from '../services/map.service';
import { MapRecorderComponent } from '../map-recorder/map-recorder.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule

  ],
  declarations: [HomePage, ActivityListComponent, MapComponent, MapRecorderComponent],
  providers: [ 
    ActivityService, 
    MapService
  ],
})
export class HomePageModule {}
