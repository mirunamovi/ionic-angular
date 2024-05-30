import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { firstValueFrom, map } from 'rxjs';
import { UserInterface } from '../ts/interfaces';
import { HomeService } from './home.service';
import { NetworkAwareHandler} from '../NetworkAware/NetworkAware.directive';
import { ConnectionStatus, NetworkService } from '../NetworkAware/network.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.css'],
})
export class HomePage extends NetworkAwareHandler{

  protected override onNetworkStatusChange(status: ConnectionStatus) {
    if (status === ConnectionStatus.Offline) {
      this.handleOfflineStatus();
    } else {
      this.handleOnlineStatus();
    }
  }

  private handleOfflineStatus() {
    // Handle offline status
    console.log('Network is offline. Taking appropriate actions.');
    // Add your logic here
  }

  private handleOnlineStatus() {
    // Handle online status
    console.log('Network is online. Taking appropriate actions.');
    // Add your logic here
  }
 
  name: any;
  constructor(public platform: Platform, public alertCtrl: AlertController, private homeService: HomeService, networkService: NetworkService) { 
    super(networkService);
    platform.ready().then(() => {
        // Check if the platform is ready before attempting to register the back button action
        this.platform.backButton.subscribeWithPriority(10, () => {
          this.presentExitConfirmation();
      });
    });
}
  override async ngOnInit() {
    
    super.ngOnInit();

    this.homeService.getUser().subscribe(
      (user: UserInterface) => {
        this.name = user.name;
      },
      (error) => {
        // Handle error if needed
        console.error('Error occurred while fetching user:', error);
      }
    );

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
