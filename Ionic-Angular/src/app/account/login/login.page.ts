// login.page.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { catchError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NetworkAwareHandler } from 'src/app/NetworkAware/NetworkAware.directive';
import { ConnectionStatus, NetworkService } from 'src/app/NetworkAware/network.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.css'],
})
export class LoginPage extends NetworkAwareHandler {
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

  // screen: any = 'signin';

  error: string = '';
  isToastOpen: boolean = false;
  toastMessage = 'Welcome to PeakGeek';

  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    protected override networkService: NetworkService  ) {
    super(networkService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.networkService.onNetworkChange().subscribe(status => {
      this.currentStatus = status;
      console.log('Network status changed:', status);
      this.onNetworkStatusChange(status);
    });

    this.currentStatus = this.networkService.getCurrentNetworkStatus();
    console.log('Initial network status in component:', this.currentStatus);
  }


  login() {
    console.log(this.currentStatus);
    if (this.currentStatus === ConnectionStatus.Online) {

      if (this.loginFormGroup.valid) {
        
        const email = this.loginFormGroup.get('email')!.value;
        const password = this.loginFormGroup.get('password')!.value;

        this.authService.login({ email, password })
          .pipe(
            tap((response) => {
              localStorage.setItem('token', response.accessToken);
              console.log(response);
              if(response.accessToken != null){
                this.setOpen(true);
                this.toastMessage = 'Login Successfully';
                this.router.navigate(['/home']);
              }
              else {
                this.setOpen(true);
                this.toastMessage = 'User or Password not valid.';
              }
              
            }),
            catchError(error => {
              console.error('Login failed', error);
              // Handle login error
              this.setOpen(true);
              this.toastMessage = 'User or Password not valid.';
              throw error; // Re-throw the error to propagate it further
            })
          )
          .subscribe();
      } else { 
        this.setOpen(true);
        this.toastMessage = 'User or Password not valid.';
      }
  }else {
    this.setOpen(true);
    this.toastMessage = 'No Internet Connection. You can use the app only for recording.';
  }

} 


  moveToRegister() {
    console.log("Vreau sa merg la register");
    this.router.navigate(['/register']);
  }

  moveToRecorder() {
    console.log("Vreau sa merg la recorder");
    let isOffline = false;
    this.router.navigate(['/record']).then(() => console.log("merge")).catch(() => console.log("nu merge"));
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }


}
