import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { HttpClient } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GraphRendererService } from '../graph-section/graph-utils/graph-renderer.service';
import { of } from 'rxjs';
import { Project } from '../graph-section/graph-utils/graph.datamodel';

describe('ProjectService', () => {
  const httpClientMock = { get: jest.fn(), put: jest.fn() };
  const graphRendererServiceMock = { renderProjects: jest.fn(), renderElementUpdate: jest.fn() };
  let service;
  let store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: httpClientMock},
        provideMockStore(),
        {provide: MatSnackBar, useValue: {open: jest.fn()}},
        {provide: GraphRendererService, useValue: graphRendererServiceMock}
      ]
    });
    service = TestBed.inject(ProjectService);
    store = TestBed.inject(MockStore);
  });

  it('should retrieve the projects and update the graph', () => {
    jest.spyOn(httpClientMock, 'get').mockReturnValue(of([{name : "test"}]));
    jest.spyOn(graphRendererServiceMock, 'renderProjects');
    jest.spyOn(store, 'dispatch');

    service.getProjects();
    expect(httpClientMock.get).toHaveBeenCalledWith('/gums/project', expect.anything());
    expect(graphRendererServiceMock.renderProjects).toHaveBeenCalledWith([{name : "test"}]);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should edit the project and update the graph', () => {
    jest.spyOn(httpClientMock, 'put').mockReturnValue(of({}));
    jest.spyOn(graphRendererServiceMock, 'renderElementUpdate');
    jest.spyOn(store, 'dispatch');
    const project = new Project('id', 'name', 'content', [], [], 'ownerId', []);

    service.editProject(project);

    expect(httpClientMock.put).toHaveBeenCalledWith('/gums/project/id', project, expect.anything());
    expect(graphRendererServiceMock.renderElementUpdate).toHaveBeenCalledWith(project.id, project.name);
    expect(store.dispatch).toHaveBeenCalled();
  });
});