import { Component } from '@angular/core';
import { UserService } from '../shared/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FullUser } from '../graph-section/graph-utils/graph.datamodel';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  userFormGroup: FormGroup;
  
  constructor(
    private userService: UserService,
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

  isUserFormValid() {
    const isAdmin = this.userFormGroup.controls['isAdmin'].value;
    const adminKey = this.userFormGroup.controls['adminKey'].value;
    return this.userFormGroup.valid && ((isAdmin && adminKey !== '') || !isAdmin);
  }
}
