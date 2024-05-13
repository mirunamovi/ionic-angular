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

  // screen: any = 'signin';

  error: string = '';

  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required]),
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
      
      const email = this.loginFormGroup.get('email')!.value;
      const password = this.loginFormGroup.get('password')!.value;

      this.authService.login({ email, password })
        .pipe(
          tap((response) => {
            localStorage.setItem('token', response.accessToken);
            console.log(response);
            if(response.accessToken != null){
              this.error = 'Login Successfully';
              this.router.navigate(['/home']);
            }
            else {
              this.error = 'User or Password not valid.';
            }
            
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

  moveToRegister() {
    console.log("Vreau sa merg la register");
    this.router.navigate(['/register']);
  }



  // change(event: any){
  //   this.screen = event;
  // }


}
