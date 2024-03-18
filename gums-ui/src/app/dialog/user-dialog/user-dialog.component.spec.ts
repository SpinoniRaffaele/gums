import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDialogComponent } from './user-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { FullUser, User } from '../../graph-section/graph-utils/graph.datamodel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogMode } from '../dialog.metadata';

describe('UserDialogComponent', () => {
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;
  const mockDialogRef = {close: jest.fn()};
  const mockUserService = {addUser: jest.fn(), editUser: jest.fn(), deleteUser: jest.fn()};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: MatDialogRef, useValue: mockDialogRef},
        FormBuilder,
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: UserService, useValue: mockUserService},
        {provide: MatSnackBar, useValue: {open: jest.fn()}}
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add valid user', () => {
    jest.spyOn(mockUserService, 'addUser');
    jest.spyOn(mockDialogRef, 'close');
    component.data = {mode: DialogMode.Create};
    component.userFormGroup.controls['name'].setValue('John Doe');
    component.userFormGroup.controls['age'].setValue(24);
    component.userFormGroup.controls['email'].setValue('email');
    component.userFormGroup.controls['password'].setValue('password');
    component.userFormGroup.controls['isAdmin'].setValue(false);

    component.submitForm();

    expect(mockUserService.addUser).toHaveBeenCalledWith(
        new FullUser("DUMMY", "John Doe", "email", 24, false, "", "password"));
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should not add invalid user', () => {
    jest.spyOn(mockUserService, 'addUser');
    component.data = {mode: DialogMode.Create};
    component.userFormGroup.controls['name'].setValue('');
    component.userFormGroup.controls['age'].setValue(25);
    component.userFormGroup.controls['email'].setValue('email');
    component.userFormGroup.controls['password'].setValue('password');
    component.userFormGroup.controls['isAdmin'].setValue(false);

    component.submitForm();

    expect(mockUserService.addUser).toHaveBeenCalledTimes(0);
  });

  it('should not add admin user without adminKey', () => {
    jest.spyOn(mockUserService, 'addUser');
    component.data = {mode: DialogMode.Create};
    component.userFormGroup.controls['name'].setValue('john doe');
    component.userFormGroup.controls['age'].setValue(25);
    component.userFormGroup.controls['email'].setValue('email');
    component.userFormGroup.controls['password'].setValue('password');
    component.userFormGroup.controls['isAdmin'].setValue(true);
    component.userFormGroup.controls['adminKey'].setValue('');

    component.submitForm();

    expect(mockUserService.addUser).toHaveBeenCalledTimes(0);
  });

  it('should correctly edit user', () => {
    jest.spyOn(mockUserService, 'editUser');
    jest.spyOn(mockDialogRef, 'close');
    component.data = {
      mode: DialogMode.Edit,
      user: new FullUser("id", "John Doe", "email", 25, false, "", "password")
    };
    component.userFormGroup.controls['name'].setValue('new name');
    component.userFormGroup.controls['age'].setValue(25);
    component.userFormGroup.controls['email'].setValue('email');
    component.userFormGroup.controls['password'].setValue('password');
    component.userFormGroup.controls['isAdmin'].setValue(false);

    component.submitForm();

    expect(mockUserService.editUser).toHaveBeenCalledWith(
        new User("id", "new name", "email", 25, false));
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should correctly delete user', () => {
    jest.spyOn(mockUserService, 'deleteUser');
    jest.spyOn(mockDialogRef, 'close');
    component.data = {
      mode: DialogMode.Edit,
      user: new FullUser("id", "John Doe", "email", 25, false, "", "password")
    };

    component.deleteUser();

    expect(mockUserService.deleteUser).toHaveBeenCalledWith("id");
    expect(mockDialogRef.close).toHaveBeenCalled();
  });


  it('on close click should close dialog', () => {
    jest.spyOn(mockDialogRef, 'close');

    component.onCloseClick();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
