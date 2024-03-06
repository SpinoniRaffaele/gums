import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { AddUserCompleted, GetUsersCompleted } from "../graph-section/graph.action";
import { GraphRendererService } from "../graph-section/graph-utils/graph-renderer.service";
import { FullUser } from '../graph-section/graph-utils/graph.datamodel';
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
          this.graphRenderer.renderGraph({projects: [], users: data});
        },
        error: error => {
          alert(error.error.message);
        }
      });
  }

  addUser(user: FullUser) {
    this.httpClient.post(this.BASE_USER_PATH, user, { headers: this.loginService.getAuthHeader() })
      .subscribe({
        next: _ => {
          this.store.dispatch(AddUserCompleted({ newUser: user }))
          this.graphRenderer.renderNewUsers([user]);
        },
        error: error => {
          alert(error.error.message);
        }
      });
  }
}
