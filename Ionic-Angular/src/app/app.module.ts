import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'

import { appRoutes } from '../routes';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginPage } from './account/login/login.page';
import { HomePage } from './home/home.page';


@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    FormsModule, 
    HttpClientModule,

    IonicModule.forRoot(), 
    AppRoutingModule,
    // RouterModule.forRoot(appRoutes)],
  ],
    providers: [ 
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      HttpClientModule, 

    ],

  bootstrap: [AppComponent],
})

export class AppModule {}


  