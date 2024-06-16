import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { UserInterface } from '../ts/interfaces';
import { catchError, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent  implements OnInit {

  isToastOpen: boolean = false;
  toastMessage = 'Welcome to PeakGeek';

  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  onSubmit(){
    if (this.resetPasswordForm.valid) {
      console.log("este valid");
      if (
        this.resetPasswordForm.get('password')?.value !=this.resetPasswordForm.get('confirmPassword')?.value
       ) {
        this.toastMessage =
          'Confirm Password is not the same as the password you provided.';
        this.setOpen(true);
        return;
      }
      else {
        console.log("A trecut de validarea celor doua parole.");
      }
  }

  const password = this.resetPasswordForm.get('password')!.value;
  console.log(password);
   const email = this.getEmailFromSession();

   this.authService
          .resetPassword({ email, password })
          .pipe(
            tap(() => {
              console.log("am intrat in authservice resetpassword");
                this.toastMessage =
                'Changing Password Successfully.';                
                this.router.navigate(['/home']);
            }),
            catchError((error) => {
              return this.toastMessage = 'Changing Password Unsuccessfully.'; 

          })
        )
          .subscribe();
  
}

getEmailFromSession(): string | null {
  const userString = sessionStorage.getItem('user');
  if (userString) {
    const user: UserInterface = JSON.parse(userString);
    return user.email;
  }
  return null;
}

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

}
