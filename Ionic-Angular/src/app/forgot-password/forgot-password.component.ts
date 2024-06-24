import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private forgotPasswordService: ForgotPasswordService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passCode: ""
    });
  }

  onSendMail() {
    console.log("onSendMail");
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;

      this.forgotPasswordService.forgotPasswordSendEmail(email).subscribe({
        next: () => this.message = 'Password reset code sent to your email.',
        error: (err) => this.error = err.error.message
      });
    }
  }
  onSendCode() {
    console.log("onSendCode");    
    if (this.forgotPasswordForm.valid) {
      const password = this.forgotPasswordForm.value.passCode.trim();
      const email = this.forgotPasswordForm.value.email.trim();
      console.log("onSendCode " + email + " " + password);
      this.forgotPasswordService.forgotPasswordSubmitCode({ email, password }).subscribe({
        next: () => this.message = 'Password code sent',
        error: (err) => this.error = err.error.message
      });
    }
  }





}
