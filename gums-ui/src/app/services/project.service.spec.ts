import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { HttpClient } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GraphRendererService } from '../graph-section/graph-services/graph-renderer.service';
import { of } from 'rxjs';
import { Project } from '../graph-section/graph-services/graph.datamodel';

describe('ProjectService', () => {
  const httpClientMock = { get: jest.fn(), put: jest.fn(), delete: jest.fn(), post: jest.fn() };
  const graphRendererServiceMock = {
    renderNewProjects: jest.fn(),
    renderElementUpdate: jest.fn(),
    renderElementDelete: jest.fn()
  };
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
    jest.spyOn(graphRendererServiceMock, 'renderNewProjects');
    jest.spyOn(store, 'dispatch');

    service.getProjects();
    expect(httpClientMock.get).toHaveBeenCalledWith('/gums/project', expect.anything());
    expect(graphRendererServiceMock.renderNewProjects).toHaveBeenCalledWith([{name : "test"}]);
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

  it('should delete the project and update the graph', () => {
    jest.spyOn(httpClientMock, 'delete').mockReturnValue(of({}));
    jest.spyOn(graphRendererServiceMock, 'renderElementDelete');
    jest.spyOn(store, 'dispatch');

    service.deleteProject("1");

    expect(httpClientMock.delete).toHaveBeenCalledWith('/gums/project/1', expect.anything());
    expect(graphRendererServiceMock.renderElementDelete).toHaveBeenCalledWith("1");
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should create the project and update the graph', () => {
    const project = new Project('id', 'name', 'content', [], [], 'ownerId', []);
    jest.spyOn(httpClientMock, 'post').mockReturnValue(of(project));
    jest.spyOn(graphRendererServiceMock, 'renderNewProjects');
    jest.spyOn(store, 'dispatch');

    service.createProject(project);

    expect(httpClientMock.post).toHaveBeenCalledWith('/gums/project', project, expect.anything());
    expect(graphRendererServiceMock.renderNewProjects).toHaveBeenCalledWith([project]);
    expect(store.dispatch).toHaveBeenCalled();
  });
});