import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { MapRecorderComponent } from './map-recorder.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MapRecorderService } from './map-recorder.service';
import { MapRecorderRoutingModule } from './map-recorder-routing.module';



@NgModule({
  declarations: [
    MapRecorderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // HttpClientModule,
    MapRecorderRoutingModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    MapRecorderService
  ],
})
export class MapRecorderModule { }
