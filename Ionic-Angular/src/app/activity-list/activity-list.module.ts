import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityListRoutingModule } from './activity-list-routing.module';
import { ActivityListComponent } from './activity-list.component';
import { IonicModule } from '@ionic/angular';
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { RouterModule } from '@angular/router';
import { ThumbnailViewerComponent } from '../thumbnail-viewer/thumbnail-viewer.component';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ActivityListRoutingModule
  ],
  declarations: [ActivityListComponent, ThumbnailViewerComponent],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class ActivityListModule { }
