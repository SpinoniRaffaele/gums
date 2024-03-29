import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { GraphRendererService } from '../graph-section/graph-services/graph-renderer.service';
import { of } from 'rxjs';
import { User } from '../graph-section/graph-services/graph.datamodel';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('test ServiceService', () => {
  let service: UserService;
  const graphRendererServiceMock = {
    renderNewUsers: jest.fn(),
    renderUserUpdate: jest.fn(),
    renderElementDelete: jest.fn(),
    renderElementUpdate: jest.fn()
  };
  const httpClientMock = {get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn()};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: httpClientMock},
        provideMockStore(),
        {provide: GraphRendererService, useValue: graphRendererServiceMock},
        {provide: MatSnackBar, useValue: {open: jest.fn()}}
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should get users and update the graph', () => {
    jest.spyOn(httpClientMock, 'get').mockReturnValue(of([{name: 'test'}]));
    jest.spyOn(graphRendererServiceMock, 'renderNewUsers');
    service.getUsers();
    expect(httpClientMock.get).toHaveBeenCalledWith('/gums/user', expect.anything());
    expect(graphRendererServiceMock.renderNewUsers).toHaveBeenCalledWith([{name: 'test'}]);
  });

  it('should add user and update the graph', () => {
    const user = new User("id", "name", "email", 12, true);
    jest.spyOn(httpClientMock, 'post').mockReturnValue(of(user));
    jest.spyOn(graphRendererServiceMock, 'renderNewUsers');
    service.addUser({name: 'test'} as any);
    expect(httpClientMock.post).toHaveBeenCalledWith('/gums/user', {name: 'test'}, expect.anything());
    expect(graphRendererServiceMock.renderNewUsers).toHaveBeenCalledWith([user]);
  });

  it('should edit user and update the graph', () => {
    jest.spyOn(httpClientMock, 'put').mockReturnValue(of(null));
    jest.spyOn(graphRendererServiceMock, 'renderUserUpdate');
    const user = new User("id", "name", "email", 12, true);
    service.editUser(user);
    expect(httpClientMock.put).toHaveBeenCalledWith('/gums/user', user, expect.anything());
    expect(graphRendererServiceMock.renderElementUpdate).toHaveBeenCalledWith(user.id, user.name);
  });

  it('should delete the user and update the graph', function () {
    jest.spyOn(httpClientMock, 'delete').mockReturnValue(of(null));
    jest.spyOn(graphRendererServiceMock, 'renderElementDelete');

    service.deleteUser("id");
    expect(httpClientMock.delete).toHaveBeenCalledWith('/gums/user/id', expect.anything());
    expect(graphRendererServiceMock.renderElementDelete).toHaveBeenCalledWith("id");
  });
});
