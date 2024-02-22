import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphSectionComponent } from './graph-section.component';
import { GraphRendererService } from './graph-utils/graph-renderer.service';
import { UserService } from '../shared/user.service';

describe('GraphSectionComponent', () => {
  let component: GraphSectionComponent;
  let fixture: ComponentFixture<GraphSectionComponent>;
  let userServiceMock = {getUsers: jest.fn()};
  let graphRendererServiceMock = {initializeScene: jest.fn()};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphSectionComponent],
      providers: [
        {provide: UserService, useValue: userServiceMock},
        {provide: GraphRendererService, useValue: graphRendererServiceMock}
      ]
    });
    fixture = TestBed.createComponent(GraphSectionComponent);
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
});
