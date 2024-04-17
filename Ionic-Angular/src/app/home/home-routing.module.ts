 import { NgModule } from '@angular/core';
 import { RouterModule, Routes } from '@angular/router';
 import { HomePage } from './home.page';
 import { MapComponent} from '../map/map.component';
 import { ActivityListComponent } from '../activity-list/activity-list.component';
 import { MapRecorderComponent } from '../map-recorder/map-recorder.component';

 const routes: Routes = [
    {
      path: '',
      component: HomePage,
      pathMatch: 'full'
    },
    { path: 'record', component: MapRecorderComponent },
    { path: 'runs', component: ActivityListComponent },
    { path: 'run/:id', component: MapComponent },    
 ];

 @NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
