import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityListRoutingModule } from './activity-list-routing.module';
import { ActivityListComponent } from './activity-list.component';
import { MapComponent } from '../map/map.component';
import { MapService } from './services/map.service';
import { ActivityService } from './services/activity.service';
import { IonicModule } from '@ionic/angular';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    // HttpClientModule,
    ActivityListRoutingModule
  ],
  declarations: [ActivityListComponent, MapComponent],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ActivityService, 
    MapService
  ],
})
export class ActivityListModule { }
