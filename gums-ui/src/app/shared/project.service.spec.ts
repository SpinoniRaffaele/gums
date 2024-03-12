import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { HttpClient } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GraphRendererService } from '../graph-section/graph-utils/graph-renderer.service';
import { of } from 'rxjs';

describe('ProjectService', () => {
  const httpClientMock = { get: jest.fn() };
  const graphRendererServiceMock = { renderProjects: jest.fn() };
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

  it('should retrieve the projects and update the graph', function () {
    jest.spyOn(httpClientMock, 'get').mockReturnValue(of([{name : "test"}]));
    jest.spyOn(graphRendererServiceMock, 'renderProjects');
    jest.spyOn(store, 'dispatch');

    service.getProjects();
    expect(httpClientMock.get).toHaveBeenCalledWith('/gums/project', expect.anything());
    expect(graphRendererServiceMock.renderProjects).toHaveBeenCalledWith([{name : "test"}]);
    expect(store.dispatch).toHaveBeenCalled();
  });
});