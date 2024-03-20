import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../dialog/user-dialog/user-dialog.component';
import { Store } from '@ngrx/store';
import { selectSelectedElement } from '../graph-section/graph.reducer';
import { ElementType, Project, User } from '../graph-section/graph-services/graph.datamodel';
import { Subscription } from 'rxjs';
import { UnselectElementCompleted } from '../graph-section/graph.action';
import { DialogMode } from '../dialog/dialog.metadata';
import { ProjectDialogComponent } from '../dialog/project-dialog/project-dialog.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnDestroy {

  subscriptions: Subscription[] = [];
  
  constructor(
    private loginService: AuthService,
    private dialog: MatDialog,
    private store: Store
  ) {
    this.subscriptions.push(this.store.select(selectSelectedElement)
        .subscribe((selected: { element: User | Project, type: ElementType }) => {
          if (!selected.element) return;
          const dialogComponent: any = selected.type === ElementType.USER ?
              UserDialogComponent : ProjectDialogComponent;
          const dialogRef = this.dialog.open(dialogComponent, {
                data: {mode: DialogMode.Edit, [selected.type.valueOf()]: selected.element},
                minWidth: '30%'
              });
          dialogRef.afterClosed().subscribe(() => {
            this.store.dispatch(UnselectElementCompleted());
          });
        }));
  }

  newUser() {
    this.dialog.open(UserDialogComponent, {
      data: {mode: DialogMode.Create},
      minWidth: '30%'
    });
  }

  newProject() {
    this.dialog.open(ProjectDialogComponent, {
      data: {mode: DialogMode.Create},
      minWidth: '30%'
    });
  }

  logout() {
    this.loginService.logout();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
