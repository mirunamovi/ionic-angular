import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapComponent } from './map.component';
import { MapRoutingModule } from './map-routing.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MapViewComponent } from '../map-view/map-view.component';



@NgModule({
  declarations: [
    MapComponent,
    MapViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    HttpClientModule,
    MapRoutingModule
  ]
})
export class MapModule { }
