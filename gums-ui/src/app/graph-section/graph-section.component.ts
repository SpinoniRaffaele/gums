import { Component, OnInit } from '@angular/core';
import { UserService } from "../shared/user.service";
import { GraphRendererService } from "./graph-utils/graph-renderer.service";
import { Store } from '@ngrx/store';
import { selectNoElementsToDisplay } from './graph.reducer';
import { ProjectService } from '../shared/project.service';

@Component({
  selector: 'app-graph-section',
  templateUrl: './graph-section.component.html'
})
export class GraphSectionComponent implements OnInit {

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
}
