import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loginFormGroup: FormGroup;

  hide = true;

  constructor(
      private loginService: AuthService,
      private formBuilder: FormBuilder
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
      alert('Please fill in the form');
    }
  }
}
