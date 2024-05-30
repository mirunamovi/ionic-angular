import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'

import { appRoutes } from '../routes';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginPage } from './account/login/login.page';
import { HomePage } from './home/home.page';
import { AuthInterceptor } from './auth/auth.interceptor';
import { Network } from '@ionic-native/network/ngx';


@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    FormsModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,

    // RouterModule.forRoot(appRoutes)],
  ],
    providers: [ 
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      Network 

    ],
  //   exports: [
  //  ,
  //  HttpClientModule, 
  //   ]
  bootstrap: [AppComponent],
})

export class AppModule {}



function join(__dirname: string, arg1: string, arg2: string) {
  throw new Error('Function not implemented.');
}
  