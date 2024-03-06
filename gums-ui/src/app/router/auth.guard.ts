import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private readonly loginService: AuthService, private readonly router: Router) { }

  canActivate(_route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): boolean {
    const loggedIn = this.loginService.isLoggedIn();
    if (!loggedIn && !state.url.endsWith('login')) {
      this.router.navigate(['/login']);
    }
    if (loggedIn && state.url.endsWith('login')) {
      this.router.navigate(['/admin']);
    }
    return state.url.endsWith('login') ? !loggedIn : loggedIn;
  }
}