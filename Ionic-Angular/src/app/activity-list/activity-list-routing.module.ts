import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityListComponent } from './activity-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { ThumbnailViewerComponent } from '../thumbnail-viewer/thumbnail-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityListComponent
  },
  {
    path: 'activity/:trackId',
    loadChildren: () =>
      import('src/app/map/map.module').then((m) => m.MapModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityListRoutingModule {}
