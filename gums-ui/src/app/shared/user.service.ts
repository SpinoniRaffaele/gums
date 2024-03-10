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

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly BASE_USER_PATH = "/gums-1/user";

  constructor(
    private httpClient: HttpClient,
    private readonly loginService: AuthService,
    private readonly store: Store,
    private readonly graphRenderer: GraphRendererService
  ) { }

  getUsers() {
    this.httpClient.get(this.BASE_USER_PATH, { headers: this.loginService.getAuthHeader() })
      .subscribe({
        next: (data: any) => {
          this.store.dispatch(GetUsersCompleted({ users: data }));
          this.graphRenderer.renderGraph({projects: [], users: data, selectedUserId: null});
        },
        error: error => {
          alert(error.error.message);
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
          alert(error.error.message);
        }
      });
  }

  editUser(user: User) {
    this.httpClient.put(this.BASE_USER_PATH, user, { headers: this.loginService.getAuthHeader() })
        .subscribe({
          next: _ => {
            this.store.dispatch(EditUserCompleted({ editedUser: user }));
            this.graphRenderer.renderUserUpdate(user);
          },
          error: error => {
            alert(error.error.message);
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
            alert(error.error.message);
          }
        });
  }
}
