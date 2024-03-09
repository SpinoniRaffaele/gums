import { Component, OnInit } from '@angular/core';
import { UserService } from "../shared/user.service";
import { GraphRendererService } from "./graph-utils/graph-renderer.service";
import { Store } from '@ngrx/store';
import { selectNoElementsToDisplay } from './graph.reducer';

@Component({
  selector: 'app-graph-section',
  templateUrl: './graph-section.component.html'
})
export class GraphSectionComponent implements OnInit {

  noElementsToDisplay: boolean;

  constructor(
      private userService: UserService,
      private readonly graphRenderer: GraphRendererService,
      private store: Store
  ) {
  }

  ngOnInit() {
    this.graphRenderer.initializeScene(document.getElementById("3d-renderer"));
    this.userService.getUsers();
    this.store.select(selectNoElementsToDisplay).subscribe(noElementsToDisplay => {
      this.noElementsToDisplay = noElementsToDisplay;
    })
  }
}
