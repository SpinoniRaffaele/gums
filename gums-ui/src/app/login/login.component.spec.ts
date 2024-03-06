import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

describe('Login Component', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  const mockAuthService = { login: jest.fn(), logout: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        FormBuilder
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call the service if the form is valid', () => {
    component.loginFormGroup.controls['username'].setValue('John Doe');
    component.loginFormGroup.controls['password'].setValue('password');
    jest.spyOn(mockAuthService, 'login');

    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledWith('John Doe', 'password');
  });

  it('should not call the service if the form is invalid', () => {
    jest.spyOn(mockAuthService, 'login');
    component.loginFormGroup.controls['username'].setValue('');
    component.loginFormGroup.controls['password'].setValue('');

    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledTimes(0);
  });
});