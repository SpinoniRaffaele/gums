import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { UserService } from '../shared/user.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FullUser } from '../graph-section/graph-utils/graph.datamodel';
import { AuthService } from '../shared/auth.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockUserService = { addUser: jest.fn() };
  const mockAuthService = { logout: jest.fn(), login: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: AuthService, useValue: mockAuthService},
        FormBuilder
      ]
    });
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add valid user', () => {
    jest.spyOn(mockUserService, 'addUser');
    component.userFormGroup.controls['name'].setValue('John Doe');
    component.userFormGroup.controls['age'].setValue(24);
    component.userFormGroup.controls['email'].setValue('email');
    component.userFormGroup.controls['password'].setValue('password');
    component.userFormGroup.controls['isAdmin'].setValue(false);

    component.addUser();

    expect(mockUserService.addUser).toHaveBeenCalledWith(
        new FullUser("DUMMY", "John Doe", "email", 24, false, "", "password"));
  });

  it('should not add invalid user', () => {
    jest.spyOn(mockUserService, 'addUser');
    component.userFormGroup.controls['name'].setValue('');
    component.userFormGroup.controls['age'].setValue(25);
    component.userFormGroup.controls['email'].setValue('email');
    component.userFormGroup.controls['password'].setValue('password');
    component.userFormGroup.controls['isAdmin'].setValue(false);

    component.addUser();

    expect(mockUserService.addUser).toHaveBeenCalledTimes(0);
  });

  it('should not add admin user without adminKey', () => {
    jest.spyOn(mockUserService, 'addUser');
    component.userFormGroup.controls['name'].setValue('john doe');
    component.userFormGroup.controls['age'].setValue(25);
    component.userFormGroup.controls['email'].setValue('email');
    component.userFormGroup.controls['password'].setValue('password');
    component.userFormGroup.controls['isAdmin'].setValue(true);
    component.userFormGroup.controls['adminKey'].setValue('');

    component.addUser();

    expect(mockUserService.addUser).toHaveBeenCalledTimes(0);
  });

  it('should correctly logout', () => {
    jest.spyOn(mockAuthService, 'logout');
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
