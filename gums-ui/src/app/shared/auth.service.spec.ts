import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('Auth Service', () => {
  const httpClientMock = {get: jest.fn()};
  const routerMock = {navigate: jest.fn()};
  const mockSnackBar = {open: jest.fn()};
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: httpClientMock},
        {provide: Router, useValue: routerMock},
        {provide: MatSnackBar, userValue: mockSnackBar}
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should login user', () => {
    jest.spyOn(httpClientMock, 'get').mockReturnValue(of({headers: {get: () => 'token'}}));
    jest.spyOn(routerMock, 'navigate');

    service.login('user', 'password');

    expect(httpClientMock.get).toHaveBeenCalledWith('/gums/auth/login',
        expect.objectContaining({headers: expect.objectContaining({lazyUpdate: expect.arrayContaining(
    [{"name": "Authorization", "op": "s", "value": "Basic dXNlcjpwYXNzd29yZA=="}])})}));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should logout user', () => {
    jest.spyOn(httpClientMock, 'get').mockReturnValue(of({}));
    jest.spyOn(routerMock, 'navigate');

    service.getAuthHeader = jest.fn().mockReturnValue('token');

    service.logout();

    expect(httpClientMock.get).toHaveBeenCalledWith('/gums/auth/logout', {headers: 'token'});
  });
});