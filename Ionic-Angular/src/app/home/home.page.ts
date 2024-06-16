import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Subscription, firstValueFrom, map } from 'rxjs';
import { UserInterface } from '../ts/interfaces';
import { HomeService } from './home.service';
import { NetworkAwareHandler} from '../NetworkAware/NetworkAware.directive';
import { ConnectionStatus, NetworkService } from '../NetworkAware/network.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.css'],
})
export class HomePage extends NetworkAwareHandler {
  errorMessage: string = '';

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
  private subscription: Subscription = new Subscription();

  constructor(public platform: Platform, public alertCtrl: AlertController, private homeService: HomeService, networkService: NetworkService, private authService: AuthService) { 
    super(networkService);
    platform.ready().then(() => {
        // Check if the platform is ready before attempting to register the back button action
        this.platform.backButton.subscribeWithPriority(10, () => {
          this.presentExitConfirmation();
      });
    });
    console.log("AM INTRAT IN CONSTRUCCTOR");
}
  override async ngOnInit() {
    
    super.ngOnInit();


  }
  async ionViewWillEnter(){
    const userSubscription = (await this.homeService.getUser()).subscribe(
      (user: UserInterface) => {
        if (user) {
          this.name = user.name;
        } else {
          this.errorMessage = 'User data is invalid';
        }
      },
      (error) => {
        this.errorMessage = 'Error occurred while fetching user';
        console.error(this.errorMessage, error);
      }
    );

    this.subscription.add(userSubscription);

  } 

  override async ngOnDestroy(){
    this.subscription.unsubscribe();
    console.log('Component destroyed and subscriptions unsubscribed');
  }

logout() {
    this.authService.logout().subscribe(() => {
      console.log('User logged out');
      this.ionViewDidLeave();
    });
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

ionViewDidLeave() {
  this.name = '';
}

}
