import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../graph-section/graph-utils/graph.datamodel';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
  propertiesControls: FormControl[] = [];
  properties: string[] = [];
  constructor(
      public dialogRef: MatDialogRef<ProjectDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {mode: DialogMode, project?: Project},
      private formBuilder: FormBuilder,
      private projectService: ProjectService,
      private snackBar: MatSnackBar
  ) {
    if (data.mode === DialogMode.Edit) {
      Object.keys(this.data.project.properties).forEach(key => {
          this.properties.push(key);
          this.propertiesControls.push(new FormControl(this.data.project.properties[key], [Validators.required]))
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
              data.mode === DialogMode.Edit ? data.project.ownerId : "", []),
          properties: this.formBuilder.array(
              data.mode === DialogMode.Edit ? this.propertiesControls : []),
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
      const properties = this.projectFormGroup.controls['properties'].value;
      if (this.data.mode === DialogMode.Create) {
        this.projectService.createProject(new Project(
            "DUMMY",
            name,
            content,
            collaboratorIds,
            linkedProjectIds,
            ownerId,
            this.propertiesToObject(properties)));
      } else {
        this.projectService.editProject(new Project(
            this.data.project.id,
            name,
            content,
            collaboratorIds,
            linkedProjectIds,
            ownerId,
            this.propertiesToObject(properties)));
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
    this.projectFormGroup.controls[field]
        .push(new FormControl('new value', [Validators.required]));
  }

  delete(id: string, field: string) {
    let indexOfDeletion;
    for (let i = 0; i < this.projectFormGroup.controls[field].length; i++) {
      if (this.projectFormGroup.controls[field].at(i).value === id) {
        indexOfDeletion = i;
      }
    }
    this.projectFormGroup.controls[field].removeAt(indexOfDeletion);
  }

  deleteProject() {
    if (this.data.mode === DialogMode.Edit) {
      this.projectService.deleteProject(this.data.project.id);
      this.dialogRef.close();
    }
  }

  private propertiesToObject(values: string[]) {
    const result = {};
    this.properties.forEach((key, index) => {
      result[key] = values[index];
    });
    return result;
  }

  private isProjectFormValid() {
    try {
      JSON.parse(this.projectFormGroup.controls['content'].value);
    } catch (e) {
      return false;
    }
    return this.projectFormGroup.valid;
  }

  private stringsToArrayOfControls(ids: string[]) {
    return ids.map(id => new FormControl(id, [Validators.required]));
  }
}
