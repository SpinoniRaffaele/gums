import { Component, OnInit } from '@angular/core';
import { UserService } from "../shared/user.service";
import { GraphRendererService } from "./graph-utils/graph-renderer.service";

@Component({
  selector: 'app-graph-section',
  templateUrl: './graph-section.component.html'
})
export class GraphSectionComponent implements OnInit {

  constructor(
      private userService: UserService,
      private readonly graphRenderer: GraphRendererService
  ) {
  }

  ngOnInit() {
    this.graphRenderer.initializeScene(document.getElementById("3d-renderer"));

    this.userService.getUsers();
  }
}
