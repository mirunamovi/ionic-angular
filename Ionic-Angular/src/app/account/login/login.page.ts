// login.page.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.css'],
})
export class LoginPage implements OnInit {

  screen: any = 'signin';

  loginFormGroup: FormGroup = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
  }

  login() {
    if (this.loginFormGroup.valid) {
      const email = this.loginFormGroup.get('username')!.value;
      const password = this.loginFormGroup.get('password')!.value;

      this.authService.login({ email, password })
        .pipe(
          tap((response: any) => {
            localStorage.setItem('token', response.access_token);
            // Redirect or perform any other action after successful login
          }),
          catchError(error => {
            console.error('Login failed', error);
            // Handle login error
            throw error; // Re-throw the error to propagate it further
          })
        )
        .subscribe();
    }
  }




  change(event: any){
    this.screen = event;
  }


}
