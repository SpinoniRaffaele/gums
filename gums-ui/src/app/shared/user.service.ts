import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { select, Store } from "@ngrx/store";
import { GetUsersCompleted } from "../graph-section/graph.action";
import { GraphState } from "../graph-section/graph.reducer";
import { selectGraphState } from "../graph-section/graph.selector";
import { GraphRendererService } from "../graph-section/graph-utils/graph-renderer.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
      private httpClient: HttpClient,
      private readonly store: Store,
      private readonly graphRenderer: GraphRendererService
  ) {}

  getUsers() {
    this.httpClient.get("/gums-1/user", {headers: new HttpHeaders({"api-key": "test"})})
        .subscribe((data: any) => {
          if (data?.error) {
            //handle error
            console.error(data.error);
          } else {
            this.store.dispatch(GetUsersCompleted({users: data}));
            this.store.select(selectGraphState).subscribe((graphState: GraphState) => {
              this.graphRenderer.renderGraph(graphState);
            });
          }
        });
  }
}
