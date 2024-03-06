import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { GraphRendererService } from '../graph-section/graph-utils/graph-renderer.service';
import { of } from 'rxjs';

describe('test ServiceService', () => {
  let service: UserService;
  let graphRendererServiceMock = {renderGraph: jest.fn(), renderNewUsers: jest.fn()};
  let httpClientMock = {get: jest.fn(), post: jest.fn()};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: httpClientMock},
        provideMockStore(),
        {provide: GraphRendererService, useValue: graphRendererServiceMock}
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should get users and update the graph', () => {
    jest.spyOn(httpClientMock, 'get').mockReturnValue(of([{name: 'test'}]));
    jest.spyOn(graphRendererServiceMock, 'renderGraph');
    service.getUsers();
    expect(httpClientMock.get).toHaveBeenCalledWith('/gums-1/user', expect.anything());
    expect(graphRendererServiceMock.renderGraph).toHaveBeenCalledWith({projects: [], users: [{name: 'test'}]});
  });

  it('should add user and update the graph', () => {
    jest.spyOn(httpClientMock, 'post').mockReturnValue(of(null));
    jest.spyOn(graphRendererServiceMock, 'renderNewUsers');
    service.addUser({name: 'test'} as any);
    expect(httpClientMock.post).toHaveBeenCalledWith('/gums-1/user', {name: 'test'}, expect.anything());
    expect(graphRendererServiceMock.renderNewUsers).toHaveBeenCalledWith([{name: 'test'}]);
  });
});
