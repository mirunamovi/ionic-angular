import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MapComponent} from '../map/map.component';
import { ActivityListComponent } from '../activity-list/activity-list.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MapRecorderComponent } from '../map-recorder/map-recorder.component';
import { AuthInterceptor } from '../auth/auth.interceptor';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot({
      platform: {
        /** The default `desktop` function returns false for devices with a touchscreen.
        * This is not always wanted, so this function tests the User Agent instead.
        **/
        'desktop': (win) => {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(win.navigator.userAgent);
          return !isMobile;
        }
      },
    }),
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
