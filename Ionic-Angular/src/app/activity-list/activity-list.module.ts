import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityListRoutingModule } from './activity-list-routing.module';
import { ActivityListComponent } from './activity-list.component';
import { IonicModule } from '@ionic/angular';
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { CardComponent } from '../card/card.component';
import { RouterModule } from '@angular/router';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ActivityListRoutingModule
  ],
  declarations: [ActivityListComponent, CardComponent],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class ActivityListModule { }
