import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { GraphRendererService } from '../graph-section/graph-services/graph-renderer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorMessage, snackbarDuration } from '../app.datamodel';
import {
  CreateProjectCompleted,
  DeleteProjectCompleted,
  EditProjectCompleted,
  GetProjectsCompleted
} from '../graph-section/graph.action';
import { Project } from '../graph-section/graph-services/graph.datamodel';

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
          this.graphRenderer.renderNewProjects(data);
        },
        error: _ => {
          this.snackBar.open(errorMessage, 'Ok', { duration: snackbarDuration });
        }
      });
  }

  editProject(project: Project) {
    this.httpClient.put(this.BASE_PROJECT_PATH + "/" + project.id, project, {headers: this.loginService.getAuthHeader()})
        .subscribe({
          next: (_) => {
            this.store.dispatch(EditProjectCompleted({project: project}));
            this.graphRenderer.renderElementUpdate(project.id, project.name, project.ownerId);
            this.snackBar.open('Project updated', 'Ok', { duration: snackbarDuration });
          },
          error: _ => {
            this.snackBar.open(errorMessage, 'Ok', { duration: snackbarDuration });
          }
        });
  }

  deleteProject(projectId: string) {
    this.httpClient.delete(this.BASE_PROJECT_PATH + "/" + projectId, {headers: this.loginService.getAuthHeader()})
        .subscribe({
          next: (_) => {
            this.store.dispatch(DeleteProjectCompleted({projectId: projectId}));
            this.graphRenderer.renderElementDelete(projectId);
            this.snackBar.open('Project deleted', 'Ok', { duration: snackbarDuration });
          },
          error: _ => {
            this.snackBar.open(errorMessage, 'Ok', { duration: snackbarDuration });
          }
        });
  }

  createProject(project: Project) {
    this.httpClient.post(this.BASE_PROJECT_PATH, project, {headers: this.loginService.getAuthHeader()})
        .subscribe({
          next: (res: Project) => {
            this.store.dispatch(CreateProjectCompleted({project: res}));
            this.graphRenderer.renderNewProjects([res]);
            this.snackBar.open('Project created', 'Ok', { duration: snackbarDuration });
          },
          error: _ => {
            this.snackBar.open(errorMessage, 'Ok', { duration: snackbarDuration });
          }
        });
  }
}