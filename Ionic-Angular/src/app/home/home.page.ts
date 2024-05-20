import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.css'],
})
export class HomePage {
  userName: any;

  constructor(private http: HttpClient, public platform: Platform, public alertCtrl: AlertController) { 
    platform.ready().then(() => {
        // Check if the platform is ready before attempting to register the back button action
        this.platform.backButton.subscribeWithPriority(10, () => {
          this.presentExitConfirmation();
      });
    });
}
  ngOnInit() {
    // Make HTTP request to fetch user information
    // this.userName = this.http.get<any>('http://localhost:4000/user').pipe(
    //   map((response: any) => response.name.value)
    // );

    // this.userName = this.http.get<any>('http://192.168.43.66:4000/user').pipe(
    //   map((response: any) => response.name.value)
    // );

    this.userName = this.http.get<any>('http://192.168.0.105:4000/user').pipe(
      map((response: any) => response.name.value)
    );

    // this.userName = this.http.get<any>('http://192.168.0.116:4000/user').pipe(
    //   map((response: any) => response.name.value)
    // );
  } 

  private async presentExitConfirmation() {
    const alert = this.alertCtrl.create({
        header: 'App termination',
        message: 'Do you want to close the app?',
        buttons: [{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Application exit prevented!');
            }
        },{
          text: 'Close App',
          handler: () => {
              // Close the app
              if (this.platform.is('android')) {
                  (navigator as any)['app'].exitApp(); // Use navigator['app'].exitApp() for Cordova
              } else {
                  console.log('Exit app'); // Handle app closing for non-Cordova platforms
              }
          }
      }]
  });
  await (await alert).present();
}
}
