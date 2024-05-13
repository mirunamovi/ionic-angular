import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css'],
})
export class RegisterPage implements OnInit {
  error: string = '';
  isLoading: boolean = false;
  isToastOpen: boolean = false;
  toastMessage = 'Welcome to PeakGeek';

  registerFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  register() {
      if (this.registerFormGroup.valid) {
        console.log("este valid");
        if (
          this.registerFormGroup.get('password')?.value !=this.registerFormGroup.get('confirmPassword')?.value
         ) {
          this.toastMessage =
            'Confirm Password is not the same as the password you provided.';
          this.setOpen(true);
          return;
        }
        else {
          console.log("A trecut de validarea celor doua parole.");
        }

        const name = this.registerFormGroup.get('name')!.value;
        const email = this.registerFormGroup.get('email')!.value;
        const password = this.registerFormGroup.get('password')!.value;

        this.authService
          .register({ name, email, password })
          .pipe(
            tap(() => {
                this.toastMessage =
                'Register Successfully.';                
                this.router.navigate(['/login']);
            }),
            catchError((error) => {
              return this.toastMessage = ' User already used.'; 

          })
        )
          .subscribe();
    }
  }

  moveToLogin() {
    console.log("Vreau sa merg la login");
    this.router.navigate(['/login']);
  }
}

