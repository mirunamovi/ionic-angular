import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityListComponent } from '../activity-list/activity-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { ForgotPasswordComponent } from './forgot-password.component';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordRoutingModule {}
