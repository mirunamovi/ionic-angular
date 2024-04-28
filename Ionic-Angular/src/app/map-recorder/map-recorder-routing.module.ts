import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MapRecorderComponent } from './map-recorder.component';

const routes: Routes = [
  {
    path: '',
    component: MapRecorderComponent,
  }
  ]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MapRecorderRoutingModule { }
