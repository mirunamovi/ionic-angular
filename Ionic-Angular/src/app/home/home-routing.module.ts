import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { MapComponent } from '../map/map.component';
import { ActivityListComponent } from '../activity-list/activity-list.component';
import { MapRecorderComponent } from '../map-recorder/map-recorder.component';
import { AuthGuardService } from '../auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'record',
    loadChildren: () =>
      import('src/app/map-recorder/map-recorder.module').then(
        (m) => m.MapRecorderModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'activities',
    loadChildren: () =>
      import('src/app/activity-list/activity-list.module').then(
        (m) => m.ActivityListModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'tracks/upload',
    loadChildren: () =>
      import('src/app/upload-tracks/upload-tracks.module').then(
        (m) => m.UploadTracksModule
      ),
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
