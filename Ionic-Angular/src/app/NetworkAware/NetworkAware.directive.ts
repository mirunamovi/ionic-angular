import { OnInit, OnDestroy, Component, Directive } from '@angular/core';
import { Subscription } from 'rxjs';
import { NetworkService, ConnectionStatus } from './network.service';

@Directive()
export abstract class NetworkAwareHandler implements OnInit, OnDestroy {
  currentStatus!: ConnectionStatus;
  private networkStatusSubscription!: Subscription;

  constructor(protected networkService: NetworkService) { }

  ngOnInit() {
    this.networkStatusSubscription = this.networkService.onNetworkChange().subscribe(status => {
      this.currentStatus = status;
      console.log('Network status changed:', status);
    });

    this.currentStatus = this.networkService.getCurrentNetworkStatus();
  }

  ngOnDestroy() {
    if (this.networkStatusSubscription) {
      this.networkStatusSubscription.unsubscribe();
    }
  }

  protected abstract onNetworkStatusChange(status: ConnectionStatus): void;

}
