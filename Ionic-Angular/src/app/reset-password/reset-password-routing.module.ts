import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityListComponent } from '../activity-list/activity-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPasswordRoutingModule {}
