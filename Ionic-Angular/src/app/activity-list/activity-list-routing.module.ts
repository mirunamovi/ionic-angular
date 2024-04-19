import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityListComponent } from './activity-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from '../map/map.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityListComponent,
    children:[
            { 
              path: 'run/:id', 
            //   loadChildren: () =>
            //   import('src/app/map/map.component').then(
            //   (m) => m.MapComponent
            // ),
            component: MapComponent
           },    
          ]

  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ActivityListRoutingModule { }
