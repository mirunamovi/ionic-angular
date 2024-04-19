import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { MapComponent } from './map/map.component';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./account/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuardService],
  },

  //  {
  //   path: '',
  //   redirectTo: '/login',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./account/login/login.module').then( m => m.LoginPageModule)
  // },
  // {
  //   path: 'home',
  //   canActivate: [AuthGuardService],
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
  //   children: [

  //     { 
  //       path: 'record', 
  //       loadChildren: () =>
  //       import('src/app/map-recorder/map-recorder.module').then(
  //         (m) => m.MapRecorderModule
  //       ),
  //     },
  //     { 
  //       path: 'runs', 
  //       loadChildren: () =>
  //       import('src/app/activity-list/activity-list.module').then(
  //         (m) => m.ActivityListModule
          
  //       ),
  //       children:[
  //         { 
  //           path: 'run/:id', 
  //         //   loadChildren: () =>
  //         //   import('src/app/map/map.component').then(
  //         //   (m) => m.MapComponent
  //         // ),
  //         component: MapComponent
  //        },    
  //       ]

  //     },
  //   ],
  // },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
