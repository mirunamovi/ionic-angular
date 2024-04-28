import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MapComponent} from '../map/map.component';
import { ActivityListComponent } from '../activity-list/activity-list.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ActivityService } from '../activity-list/services/activity.service';
import { MapService } from '../activity-list/services/map.service';
import { MapRecorderComponent } from '../map-recorder/map-recorder.component';
import { AuthInterceptor } from '../auth/auth.interceptor';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule

  ],
  declarations: 
  [ HomePage,
    // MapRecorderComponent
    // ActivityListComponent
    // ActivityService,
    // MapService,
    // MapRecorderComponent
  ],

})
export class HomePageModule {}
