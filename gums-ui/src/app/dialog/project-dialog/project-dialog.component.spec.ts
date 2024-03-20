import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDialogComponent } from './project-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../services/project.service';
import { Project, User } from '../../graph-section/graph-services/graph.datamodel';
import { DialogMode } from '../dialog.metadata';
import { provideMockStore } from '@ngrx/store/testing';

describe('ProjectDialogComponent', () => {
  let component: ProjectDialogComponent;
  let fixture: ComponentFixture<ProjectDialogComponent>;
  const mockDialogRef = {close: jest.fn()};
  const mockProjectService = {editProject: jest.fn(), deleteProject: jest.fn(), createProject: jest.fn()};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: MatDialogRef, useValue: mockDialogRef},
        FormBuilder,
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: ProjectService, useValue: mockProjectService},
        {provide: MatSnackBar, useValue: {open: jest.fn()}},
        provideMockStore()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly create project', () => {
    jest.spyOn(mockProjectService, 'createProject');
    jest.spyOn(mockDialogRef, 'close');
    component.data = {
      mode: DialogMode.Create
    };
    component.projectFormGroup.controls['name'].setValue('new name');
    component.projectFormGroup.controls['content'].setValue("{\"new\": \"content\"}");
    component.projectFormGroup.controls['ownerName'].setValue("owner");
    component.elements = {users: [{id: "1", name: "owner"} as User], projects: []};

    component.submitForm();

    expect(mockProjectService.createProject).toHaveBeenCalledWith(
        new Project("DUMMY", "new name", "{\"new\": \"content\"}", [], [], "1", {}));
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should correctly edit project', () => {
    jest.spyOn(mockProjectService, 'editProject');
    jest.spyOn(mockDialogRef, 'close');
    component.data = {
      mode: DialogMode.Edit,
      project: new Project("id", "John Doe", "{}", [],[], "user1", {})
    };
    component.projectFormGroup.controls['name'].setValue('new name');
    component.projectFormGroup.controls['content'].setValue("{\"new\": \"content\"}");
    component.projectFormGroup.controls['ownerName'].setValue("user2");
    component.elements = {users: [{id: "2", name: "user2"} as User], projects: []};

    component.submitForm();

    expect(mockProjectService.editProject).toHaveBeenCalledWith(
        new Project("id", "new name", "{\"new\": \"content\"}", [], [], "2", {}));
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should not edit project if it refers to unexisting user name', () => {
    jest.spyOn(mockProjectService, 'editProject');
    jest.spyOn(mockDialogRef, 'close');
    component.data = {
      mode: DialogMode.Edit,
      project: new Project("id", "John Doe", "{}", [],[], "user1", {})
    };
    component.projectFormGroup.controls['ownerName'].setValue("user2");
    component.elements = {users: [{id: "1", name: "user1"} as User], projects: []};

    component.submitForm();

    expect(mockProjectService.editProject).not.toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should not submit if content is not JSON', () => {
    jest.spyOn(mockProjectService, 'editProject');
    jest.spyOn(mockDialogRef, 'close');
    component.data = {
      mode: DialogMode.Edit,
      project: new Project("id", "John Doe", "{}", [],[], "user1", {})
    };
    component.projectFormGroup.controls['content'].setValue("{\"new\": invalid}");

    component.submitForm();

    expect(mockProjectService.editProject).not.toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should not submit if collaborators are duplicated', () => {
    jest.spyOn(mockProjectService, 'editProject');
    jest.spyOn(mockDialogRef, 'close');
    component.data = {
      mode: DialogMode.Edit,
      project: new Project("id", "John Doe", "{}", [],[], "user1", {})
    };
    component.projectFormGroup.controls['collaboratorIds'] = new FormArray(
        [new FormControl("user1"), new FormControl("user1")]
    );

    component.submitForm();

    expect(mockProjectService.editProject).not.toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should delete', () => {
    jest.spyOn(mockProjectService, 'deleteProject');
    jest.spyOn(mockDialogRef, 'close');
    component.data = {
      mode: DialogMode.Edit,
      project: new Project("id", "John Doe", "{}", [],[], "user1", {})
    };

    component.deleteProject();

    expect(mockProjectService.deleteProject).toHaveBeenCalledWith("id");
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
