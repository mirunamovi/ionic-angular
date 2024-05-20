import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadTracksComponent } from './upload-tracks.component';

const routes: Routes = [
  {
    path: '',
    component: UploadTracksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadTracksPageRoutingModule {}
