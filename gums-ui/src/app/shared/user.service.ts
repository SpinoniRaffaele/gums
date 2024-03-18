import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import {
  AddUserCompleted,
  DeleteUserCompleted,
  EditUserCompleted,
  GetUsersCompleted
} from "../graph-section/graph.action";
import { GraphRendererService } from "../graph-section/graph-utils/graph-renderer.service";
import { FullUser, User } from '../graph-section/graph-utils/graph.datamodel';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorMessage, snackbarDuration } from '../app.datamodel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly BASE_USER_PATH = "/gums/user";

  constructor(
    private httpClient: HttpClient,
    private readonly loginService: AuthService,
    private readonly store: Store,
    private readonly graphRenderer: GraphRendererService,
    private readonly snackBar: MatSnackBar
  ) { }

  getUsers() {
    this.httpClient.get(this.BASE_USER_PATH, { headers: this.loginService.getAuthHeader() })
      .subscribe({
        next: (data: any) => {
          this.store.dispatch(GetUsersCompleted({ users: data }));
          this.graphRenderer.renderNewUsers(data);
        },
        error: error => {
          this.snackBar.open(errorMessage, "Ok", { duration: snackbarDuration });
        }
      });
  }

  addUser(user: FullUser) {
    this.httpClient.post(this.BASE_USER_PATH, user, { headers: this.loginService.getAuthHeader() })
      .subscribe({
        next: res => {
          this.store.dispatch(AddUserCompleted({ newUser: res as User }))
          this.graphRenderer.renderNewUsers([res as User]);
        },
        error: error => {
          this.snackBar.open(errorMessage, "Ok", { duration: snackbarDuration });
        }
      });
  }

  editUser(user: User) {
    this.httpClient.put(this.BASE_USER_PATH, user, { headers: this.loginService.getAuthHeader() })
        .subscribe({
          next: _ => {
            this.store.dispatch(EditUserCompleted({ editedUser: user }));
            this.graphRenderer.renderElementUpdate(user.id, user.name);
          },
          error: error => {
            this.snackBar.open(errorMessage, "Ok", { duration: snackbarDuration });
          }
        });
  }

  deleteUser(id: string) {
    this.httpClient.delete(this.BASE_USER_PATH + "/" + id, { headers: this.loginService.getAuthHeader() })
        .subscribe({
          next: _ => {
            this.store.dispatch(DeleteUserCompleted({ deletedUserId: id }));
            this.graphRenderer.renderUserDelete(id);
          },
          error: error => {
            this.snackBar.open(errorMessage, "Ok", { duration: snackbarDuration });
          }
        });
  }
}
