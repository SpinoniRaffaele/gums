import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../graph-section/graph-utils/graph.datamodel';
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

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html'
})
export class ProjectDialogComponent {
  projectFormGroup;
  propertiesKeyControls: FormControl[] = [];
  propertiesValueControls: FormControl[] = [];
  constructor(
      public dialogRef: MatDialogRef<ProjectDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {mode: DialogMode, project?: Project},
      private formBuilder: FormBuilder,
      private projectService: ProjectService,
      private snackBar: MatSnackBar
  ) {
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
          collaboratorIds: this.formBuilder.array(
              data.mode === DialogMode.Edit ? this.stringsToArrayOfControls(data.project.collaboratorIds) : []),
          linkedProjectIds: this.formBuilder.array(
              data.mode === DialogMode.Edit ? this.stringsToArrayOfControls(data.project.linkedProjectIds) : []),
          ownerId: new FormControl(
              data.mode === DialogMode.Edit ? data.project.ownerId : "", [Validators.required]),
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
      const collaboratorIds = this.projectFormGroup.controls['collaboratorIds'].value;
      const linkedProjectIds = this.projectFormGroup.controls['linkedProjectIds'].value;
      const ownerId = this.projectFormGroup.controls['ownerId'].value;
      const propertiesGroup = this.projectFormGroup.controls['properties'];
      if (this.data.mode === DialogMode.Create) {
        this.projectService.createProject(new Project(
            "DUMMY",
            name,
            content,
            collaboratorIds,
            linkedProjectIds,
            ownerId,
            this.propertiesToObject(propertiesGroup)));
      } else {
        this.projectService.editProject(new Project(
            this.data.project.id,
            name,
            content,
            collaboratorIds,
            linkedProjectIds,
            ownerId,
            this.propertiesToObject(propertiesGroup)));
      }
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
    try {
      JSON.parse(this.projectFormGroup.controls['content'].value);
    } catch (e) {
      return false;
    }
    const collaboratorIds = this.projectFormGroup.controls['collaboratorIds'].controls.map(control => control.value);
    const linkedProjectIds = this.projectFormGroup.controls['linkedProjectIds'].controls.map(control => control.value);
    return this.projectFormGroup.valid && this.areUnique(collaboratorIds) && this.areUnique(linkedProjectIds);
  }

  areUnique(ids: string[]) {
    return !ids.some(id => ids.filter(id2 => id2 === id).length > 1);
  }

  private stringsToArrayOfControls(ids: string[]) {
    return ids.map(id => new FormControl(id, [Validators.required]));
  }

  private validateUnique(array: FormControl[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        return array.filter(form => form.value === control.value).length > 1 ? {duplicateName: true} : null;
      }
    };
  }
}
