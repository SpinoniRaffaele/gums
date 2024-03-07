import { Component } from '@angular/core';
import { UserService } from '../shared/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FullUser } from '../graph-section/graph-utils/graph.datamodel';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  userFormGroup: FormGroup;
  
  constructor(
    private userService: UserService,
    private loginService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.userFormGroup = this.formBuilder.group(
      {
        name: new FormControl('', [Validators.required]),
        age: new FormControl('', []),
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        isAdmin: new FormControl(false, []),
        adminKey: new FormControl('', []),
      }
    );
  }

  addUser() {
    if (this.isUserFormValid()) {
      const name = this.userFormGroup.controls['name'].value;
      const age = this.userFormGroup.controls['age'].value;
      const email = this.userFormGroup.controls['email'].value;
      const password = this.userFormGroup.controls['password'].value;
      const isAdmin = this.userFormGroup.controls['isAdmin'].value;
      const adminKey = this.userFormGroup.controls['adminKey'].value;
      this.userService.addUser(new FullUser("DUMMY", name, email, age, isAdmin, adminKey, password));
    } else {
      alert("invalid user data");
    }
  }

  logout() {
    this.loginService.logout();
  }

  private isUserFormValid() {
    const isAdmin = this.userFormGroup.controls['isAdmin'].value;
    const adminKey = this.userFormGroup.controls['adminKey'].value;
    return this.userFormGroup.valid && ((isAdmin && adminKey !== '') || !isAdmin);
  }
}
