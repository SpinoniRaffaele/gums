import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project, User } from '../../graph-section/graph-utils/graph.datamodel';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogMode } from '../dialog.metadata';
import { snackbarDuration } from '../../app.datamodel';
import { ProjectService } from '../../shared/project.service';
import { Store } from '@ngrx/store';
import { selectElements } from '../../graph-section/graph.reducer';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html'
})
export class ProjectDialogComponent {
  projectFormGroup;
  propertiesKeyControls: FormControl[] = [];
  propertiesValueControls: FormControl[] = [];
  elements: {users: User[], projects: Project[]};
  constructor(
      public dialogRef: MatDialogRef<ProjectDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {mode: DialogMode, project?: Project},
      private formBuilder: FormBuilder,
      private projectService: ProjectService,
      private snackBar: MatSnackBar,
      private store: Store
  ) {
    this.store.select(selectElements).subscribe(elements => {
      this.elements = elements;
    });
    if (data.mode === DialogMode.Edit) {
      Object.keys(this.data.project.properties).forEach(key => {
          this.propertiesValueControls.push(new FormControl(this.data.project.properties[key],
              [Validators.required]));
          this.propertiesKeyControls.push(new FormControl(key,
              [Validators.required, this.validateUnique(this.propertiesKeyControls)]));
      });
    }
    this.projectFormGroup = this.formBuilder.group(
        {
          name: new FormControl(
              data.mode === DialogMode.Edit ? data.project.name : '', [Validators.required]),
          content: new FormControl(
              data.mode === DialogMode.Edit ? JSON.stringify(data.project.content) : '', []),
          collaboratorNames: this.formBuilder.array(
              data.mode === DialogMode.Edit ? this.stringsToArrayOfControls(data.project.collaboratorIds) :
                  []),
          linkedProjectNames: this.formBuilder.array(
              data.mode === DialogMode.Edit ? this.stringsToArrayOfControls(data.project.linkedProjectIds) :
                  []),
          ownerName: new FormControl(
              data.mode === DialogMode.Edit ? this.findNameById(data.project.ownerId) : "",
              [Validators.required]),
          properties: this.formBuilder.group({
            propertyValues: this.formBuilder.array(
                data.mode === DialogMode.Edit ? this.propertiesValueControls : []),
            propertyKeys: this.formBuilder.array(
                data.mode === DialogMode.Edit ? this.propertiesKeyControls : []),
          })
        }
    );
  }

  submitForm() {
    if (this.isProjectFormValid()) {
      const name = this.projectFormGroup.controls['name'].value;
      const content = this.projectFormGroup.controls['content'].value;
      const collaboratorNames = this.projectFormGroup.controls['collaboratorNames'].value;
      const linkedProjectNames = this.projectFormGroup.controls['linkedProjectNames'].value;
      const ownerName = this.projectFormGroup.controls['ownerName'].value;
      const collaboratorIds = collaboratorNames
          .map(name => this.elements.users.find(user => user.name === name).id);
      const linkedProjectIds = linkedProjectNames
          .map(name => this.elements.projects.find(project => project.name === name).id);
      const ownerId = this.elements.users.find(user => user.name === ownerName).id;
      const propertiesGroup = this.projectFormGroup.controls['properties'];
      const propertiesObject = this.propertiesToObject(propertiesGroup);
      this.data.mode === DialogMode.Create ?
      this.projectService.createProject(new Project(
          "DUMMY", name, content, collaboratorIds, linkedProjectIds, ownerId, propertiesObject)) :
      this.projectService.editProject(new Project(
          this.data.project.id, name, content, collaboratorIds, linkedProjectIds, ownerId, propertiesObject));
      this.dialogRef.close();
    } else {
      this.snackBar.open("Invalid project data", "Ok", { duration: snackbarDuration });
    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  add(field: string) {
    if (field === 'properties') {
      this.propertiesKeyControls.push(new FormControl('new key',
          [Validators.required, this.validateUnique(this.propertiesKeyControls)]));
      this.propertiesValueControls.push(new FormControl('new value', [Validators.required]));
      this.projectFormGroup.controls[field].controls['propertyKeys'] = this.propertiesKeyControls;
      this.projectFormGroup.controls[field].controls['propertyValues'] = this.propertiesValueControls;
    } else {
      this.projectFormGroup.controls[field]
          .push(new FormControl('new value', [Validators.required]));
    }
  }

  delete(id: string, field: string) {
    if (field === 'properties') {
      let indexOfDeletion;
      for (let i = 0; i < this.propertiesKeyControls.length; i++) {
        if (this.propertiesKeyControls[i].value === id) {
          indexOfDeletion = i;
        }
      }
      this.propertiesKeyControls.splice(indexOfDeletion, 1);
      this.propertiesValueControls.splice(indexOfDeletion, 1);
      this.projectFormGroup.controls[field].controls['propertyValues'] = this.propertiesValueControls;
      this.projectFormGroup.controls[field].controls['propertyKeys'] = this.propertiesKeyControls;
    } else {
      let indexOfDeletion;
      for (let i = 0; i < this.projectFormGroup.controls[field].length; i++) {
        if (this.projectFormGroup.controls[field].at(i).value === id) {
          indexOfDeletion = i;
        }
      }
      this.projectFormGroup.controls[field].removeAt(indexOfDeletion);
    }
  }

  deleteProject() {
    if (this.data.mode === DialogMode.Edit) {
      this.projectService.deleteProject(this.data.project.id);
      this.dialogRef.close();
    }
  }

  private propertiesToObject(values: FormGroup) {
    const result = {};
    const valuesArray = values.controls['propertyValues'] as FormArray;
    const keysArray = values.controls['propertyKeys'] as FormArray;

    for (let i = 0; i < valuesArray.length; i++) {
      result[keysArray.at(i).value] = valuesArray.at(i).value;
    }
    return result;
  }

  private isProjectFormValid() {
    if (!this.isContentValid()) return false;

    const collaboratorNames = this.getControlValues('collaboratorNames');
    const linkedProjectNames = this.getControlValues('linkedProjectNames');

    const collaboratorUsers = this.findUsersByName(collaboratorNames);
    const linkedProjects = this.findProjectsByName(linkedProjectNames);

    return this.projectFormGroup.valid && this.areUnique(collaboratorNames) && this.areUnique(linkedProjectNames)
        && this.areAllElementsFound(collaboratorUsers) && this.areAllElementsFound(linkedProjects);
  }

  private isContentValid(): boolean {
    try {
      JSON.parse(this.projectFormGroup.controls['content'].value);
      return true;
    } catch (e) {
      return false;
    }
  }

  private getControlValues(controlName: string): string[] {
    return this.projectFormGroup.controls[controlName].controls.map(control => control.value);
  }

  private findUsersByName(names: string[]): User[] {
    return names.map(name => this.elements.users.find(user => user.name === name));
  }

  private findProjectsByName(names: string[]): Project[] {
    return names.map(name => this.elements.projects.find(project => project.name === name));
  }

  private areAllElementsFound(elements: any[]): boolean {
    return elements.filter(element => element!!).length === elements.length;
  }

  areUnique(ids: string[]) {
    return !ids.some(id => ids.filter(id2 => id2 === id).length > 1);
  }

  private stringsToArrayOfControls(ids: string[]) {
    return ids.map(id => new FormControl(this.findNameById(id), [Validators.required]));
  }

  private findNameById(id: string) {
    const user = this.elements.users.find(user => user.id === id);
    const project = this.elements.projects.find(project => project.id === id);
    return user ? user.name : project.name;
  }

  private validateUnique(array: FormControl[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        return array.filter(form => form.value === control.value).length > 1 ? {duplicateName: true} : null;
      }
    };
  }
}
