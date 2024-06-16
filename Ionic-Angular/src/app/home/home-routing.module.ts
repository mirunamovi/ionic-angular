import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
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
  {
    path: 'reset',
    loadChildren: () =>
      import('src/app/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
