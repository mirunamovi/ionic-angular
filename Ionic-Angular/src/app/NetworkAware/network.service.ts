import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject<ConnectionStatus>(ConnectionStatus.Offline);

  constructor(private network: Network, private toastController: ToastController, private plt: Platform) {
    this.plt.ready().then(() => {
      this.initializeNetworkEvents();
      const initialStatus = this.network.type !== 'none' && this.network.type !== undefined ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(initialStatus);
      console.log('Initial network status:', initialStatus);
    });
  }

  private initializeNetworkEvents() {
    this.network.onDisconnect().subscribe(() => {
      console.log('Network disconnected');
      this.updateNetworkStatus(ConnectionStatus.Offline);
    });

    this.network.onConnect().subscribe(() => {
      console.log('Network connected');
      setTimeout(() => {
        const currentType = this.network.type;
        console.log('Network type after connection:', currentType);
        if (currentType !== 'none' && currentType !== undefined) {
          this.updateNetworkStatus(ConnectionStatus. Online);
        }
      }, 3000); // Adding a small delay to ensure the network type is updated
    });
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);
    console.log('Network status updated to:', status);

    const connection = status === ConnectionStatus.Offline ? 'Offline' : 'Online';
    const toast = await this.toastController.create({
      message: `You are now ${connection}`,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }
}
