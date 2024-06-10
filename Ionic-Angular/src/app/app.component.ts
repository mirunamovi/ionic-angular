import { Component} from '@angular/core';
import { AuthStoreService } from './auth/auth-store.service';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent{

  constructor(private authStoreService: AuthStoreService, private router: Router) { 
    const accessToken = this.authStoreService.getAccessToken();
    if (!accessToken) {
      const refreshToken = this.authStoreService.getRefreshToken();
      if (refreshToken) {
        const refreshObserver: Observer<any> = {
          next: () => {
            // Access token refreshed successfully
          },
          error: () => {
            this.router.navigate(['/login']);
          },
          complete: () => {
            // Optional: Handle completion if needed
          }
        };

        this.authStoreService.refreshAccessToken().subscribe(refreshObserver);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/home']);
    }
  }
}
