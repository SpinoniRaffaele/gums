import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackbarDuration } from '../app.datamodel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loginFormGroup: FormGroup;

  hide = true;

  constructor(
      private loginService: AuthService,
      private formBuilder: FormBuilder,
      private snackBar: MatSnackBar
  ) {
    this.loginFormGroup = this.formBuilder.group(
        {
          username: new FormControl('', [Validators.required]),
          password: new FormControl('', [Validators.required]),
        }
    );
  }

  submit() {
    if (this.loginFormGroup.valid) {
      this.loginService.login(
          this.loginFormGroup.get('username').value, this.loginFormGroup.get('password').value);
    } else {
      this.snackBar.open("Please fill in the form", "Ok", {duration: snackbarDuration});
    }
  }
}
