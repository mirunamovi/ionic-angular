// login.page.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { catchError, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.css'],
})
export class LoginPage implements OnInit {

  screen: any = 'signin';

  error: string = '';

  loginFormGroup: FormGroup = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  login() {
    if (this.loginFormGroup.valid) {
      this.error = 'Login Successfully';
      const email = this.loginFormGroup.get('username')!.value;
      const password = this.loginFormGroup.get('password')!.value;

      this.authService.login({ email, password })
        .pipe(
          tap((response: any) => {
            localStorage.setItem('token', response.access_token);
            // Redirect or perform any other action after successful login
            this.router.navigate(['/home']);
          }),
          catchError(error => {
            console.error('Login failed', error);
            // Handle login error
            this.error = 'User or Password not valid.';
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
