 import { NgModule } from '@angular/core';
 import { RouterModule, Routes } from '@angular/router';
 import { HomePage } from './home.page';
 import { MapComponent} from '../map/map.component';
 import { ActivityListComponent } from '../activity-list/activity-list.component';

 const routes: Routes = [
    {
      path: '',
      component: HomePage,
    },
    { path: "runs", component: ActivityListComponent },
    { path: "run/:id", component: MapComponent },
    { path: "", redirectTo: "runs", pathMatch: 'full' }
 ];

 @NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
