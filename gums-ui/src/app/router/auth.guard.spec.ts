import { TestBed } from '@angular/core/testing';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('Auth Guard', () => {
  const authServiceMock = {isLoggedIn: jest.fn()};
  const routerMock = {navigate: jest.fn()};
  let guard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: authServiceMock},
        {provide: Router, useValue: routerMock}
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should prevent access to admin page if not logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(false);

    expect(guard.canActivate(null, {url: '/admin'})).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should prevent access to login page if already logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);

    expect(guard.canActivate(null, {url: '/login'})).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should allow access to admin page if logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);

    expect(guard.canActivate(null, {url: '/admin'})).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should allow access to login page if not logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(false);

    expect(guard.canActivate(null, {url: '/login'})).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});