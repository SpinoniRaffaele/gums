import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";
import { GraphRendererService } from "./graph-services/graph-renderer.service";
import { Store } from '@ngrx/store';
import { selectNoElementsToDisplay } from './graph.reducer';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-graph-section',
  templateUrl: './graph-section.component.html'
})
export class GraphSectionComponent implements OnInit, OnDestroy {

  noElementsToDisplay: boolean;

  constructor(
      private userService: UserService,
      private projectService: ProjectService,
      private graphRenderer: GraphRendererService,
      private store: Store
  ) {
  }

  ngOnInit() {
    this.graphRenderer.initializeScene(document.getElementById("3d-renderer"));
    this.userService.getUsers();
    this.projectService.getProjects();
    this.store.select(selectNoElementsToDisplay).subscribe(noElementsToDisplay => {
      this.noElementsToDisplay = noElementsToDisplay;
    })
  }

  ngOnDestroy() {
    this.graphRenderer.dispose();
  }
}
