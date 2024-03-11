import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackbarDuration } from '../app.datamodel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly BASE_AUTH_PATH = "/gums-1/auth";

  readonly AUTH_HEADER_NAME = 'x-auth-token';

  constructor(
      private readonly httpClient: HttpClient,
      private readonly router: Router,
      private readonly snackBar: MatSnackBar
  ) {}

  login(username: string, password: string) {
    const headers: HttpHeaders = new HttpHeaders()
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Basic ' + btoa(username + ':' + password));
    this.httpClient.get(this.BASE_AUTH_PATH + '/login', {headers: headers, observe: 'response'})
        .subscribe({
          next: (res) => {
            const authToken = res.headers.get(this.AUTH_HEADER_NAME);
            if (authToken) {
              sessionStorage.setItem(this.AUTH_HEADER_NAME, authToken);
              this.router.navigate(['/admin']);
            } else {
              this.snackBar.open('Login failed, token not found.', 'Ok',
                  {duration: snackbarDuration});
            }
          },
          error: (_) => {
            this.snackBar.open('Login failed, check your credentials.', 'Ok',
                {duration: snackbarDuration});
          }
        });
  }

  logout() {
    this.httpClient.get(this.BASE_AUTH_PATH + '/logout', {headers: this.getAuthHeader()})
        .subscribe({
          next: (_) => {
            sessionStorage.clear();
            this.router.navigate(['/login']);
          },
          error: (_) => {
            this.snackBar.open('Logout failed, are you logged in?', 'Ok',
                {duration: snackbarDuration});
          }
        });
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.AUTH_HEADER_NAME) !== null;
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders().set(this.AUTH_HEADER_NAME, sessionStorage.getItem(this.AUTH_HEADER_NAME) ?? '');
  }
}

