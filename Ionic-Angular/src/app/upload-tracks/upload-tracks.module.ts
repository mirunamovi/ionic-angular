import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadTracksPageRoutingModule } from './upload-tracks-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UploadTracksComponent } from './upload-tracks.component';



@NgModule({
  declarations: [UploadTracksComponent],
  imports: [
    CommonModule,
    UploadTracksPageRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class UploadTracksModule { }
