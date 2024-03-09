import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphSectionComponent } from './graph-section.component';
import { GraphRendererService } from './graph-utils/graph-renderer.service';
import { UserService } from '../shared/user.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

describe('GraphSectionComponent', () => {
  let component: GraphSectionComponent;
  let fixture: ComponentFixture<GraphSectionComponent>;
  let userServiceMock = {getUsers: jest.fn()};
  let graphRendererServiceMock = {initializeScene: jest.fn()};
  let store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphSectionComponent],
      providers: [
        {provide: UserService, useValue: userServiceMock},
        {provide: GraphRendererService, useValue: graphRendererServiceMock},
        provideMockStore({users: [], projects: []} as any),
      ]
    });
    fixture = TestBed.createComponent(GraphSectionComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the scene and retrieve the users', () => {
    jest.spyOn(userServiceMock, 'getUsers');
    jest.spyOn(graphRendererServiceMock, 'initializeScene');
    component.ngOnInit();

    expect(graphRendererServiceMock.initializeScene).toHaveBeenCalled();
    expect(userServiceMock.getUsers).toHaveBeenCalled();
  });

  it('should render the message if no elements are retrieved', () => {
    jest.spyOn(userServiceMock, 'getUsers');
    jest.spyOn(graphRendererServiceMock, 'initializeScene');
    jest.spyOn(store, 'select').mockReturnValue(of(true));

    component.ngOnInit();

    expect(graphRendererServiceMock.initializeScene).toHaveBeenCalled();
    expect(userServiceMock.getUsers).toHaveBeenCalled();
    expect(component.noElementsToDisplay).toBe(true);
  });
});
