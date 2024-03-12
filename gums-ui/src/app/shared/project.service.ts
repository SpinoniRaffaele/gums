import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { GraphRendererService } from '../graph-section/graph-utils/graph-renderer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorMessage, snackbarDuration } from '../app.datamodel';
import { GetProjectsCompleted } from '../graph-section/graph.action';
import { Project } from '../graph-section/graph-utils/graph.datamodel';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  readonly BASE_PROJECT_PATH = '/gums/project';

  constructor(private httpClient: HttpClient,
              private readonly loginService: AuthService,
              private readonly store: Store,
              private readonly graphRenderer: GraphRendererService,
              private readonly snackBar: MatSnackBar
  ) {}

  getProjects() {
    this.httpClient.get(this.BASE_PROJECT_PATH, { headers: this.loginService.getAuthHeader() })
      .subscribe({
        next: (data: Project[]) => {
          this.store.dispatch(GetProjectsCompleted({ projects: data }));
          this.graphRenderer.renderProjects(data);
        },
        error: _ => {
          this.snackBar.open(errorMessage, 'Ok', { duration: snackbarDuration });
        }
      });
  }
}