import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'

import { appRoutes } from '../routes';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    FormsModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    RouterModule.forRoot(appRoutes)],

    providers: [ 
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      HttpClientModule, 
    ],

  bootstrap: [AppComponent],
})

export class AppModule {}


  