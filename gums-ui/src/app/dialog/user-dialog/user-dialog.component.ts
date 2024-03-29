import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FullUser, User } from '../../graph-section/graph-services/graph.datamodel';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackbarDuration } from '../../app.datamodel';
import { DialogMode } from '../dialog.datamodel';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html'
})
export class UserDialogComponent {

  userFormGroup;
  constructor(
      public dialogRef: MatDialogRef<UserDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {mode: DialogMode, user?: FullUser},
      private formBuilder: FormBuilder,
      private userService: UserService,
      private snackBar: MatSnackBar
  ) {
    this.userFormGroup = this.formBuilder.group(
        {
          name: new FormControl(
              data.mode === DialogMode.Edit ? data.user.name : '', [Validators.required]),
          age: new FormControl(
              data.mode === DialogMode.Edit ? data.user.age : '', []),
          email: new FormControl(
              data.mode === DialogMode.Edit ? data.user.email : '', [Validators.required]),
          password: new FormControl(
              data.mode === DialogMode.Edit ? data.user.password : '', []),
          isAdmin: new FormControl(
              data.mode === DialogMode.Edit ? data.user.isAdmin : false, []),
          adminKey: new FormControl(
              data.mode === DialogMode.Edit ? data.user.adminKey : '', []),
        }
    );
    if (data.mode === DialogMode.Edit) {
      this.userFormGroup.get('isAdmin').disable();
    }
  }

  submitForm() {
    if (this.isUserFormValid()) {
      const name = this.userFormGroup.controls['name'].value;
      const age = this.userFormGroup.controls['age'].value;
      const email = this.userFormGroup.controls['email'].value;
      const password = this.userFormGroup.controls['password'].value;
      const isAdmin = this.userFormGroup.controls['isAdmin'].value;
      const adminKey = this.userFormGroup.controls['adminKey'].value;
      if (this.data.mode === DialogMode.Create) {
        this.userService.addUser(new FullUser("DUMMY", name, email, age, isAdmin, adminKey, password));
      } else {
        this.userService.editUser(new User(this.data.user.id, name, email, age, isAdmin));
      }
      this.dialogRef.close();
    } else {
      this.snackBar.open("Invalid user data", "Ok", { duration: snackbarDuration });
    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  deleteUser() {
    if (this.data.mode === DialogMode.Edit) {
      this.userService.deleteUser(this.data.user.id);
      this.dialogRef.close();
    }
  }

  private isUserFormValid() {
    const isAdmin = this.userFormGroup.controls['isAdmin'].value;
    const adminKey = this.userFormGroup.controls['adminKey'].value;
    const isPasswordValid = this.data.mode === 'Edit' ? true :
        this.userFormGroup.controls['password'].value?.length >= 8;
    return this.userFormGroup.valid && ((isAdmin && adminKey !== '') || !isAdmin) && isPasswordValid;
  }
}