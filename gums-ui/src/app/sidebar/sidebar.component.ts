import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent, UserDialogMode } from '../dialog/user-dialog/user-dialog.component';
import { Store } from '@ngrx/store';
import { selectSelectedElement } from '../graph-section/graph.reducer';
import { ElementType, Project, User } from '../graph-section/graph-utils/graph.datamodel';
import { Subscription } from 'rxjs';
import { UnselectElementCompleted } from '../graph-section/graph.action';

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
        .subscribe((selected: {element: User | Project, type: ElementType}) => {
      if (!selected.element) return;
      if (selected.type === ElementType.USER) {
        const dialogRef = this.dialog.open(UserDialogComponent, {
          data: {mode: UserDialogMode.Edit, user: selected.element},
          minWidth: '30%'
        });
        dialogRef.afterClosed().subscribe(() => {
          this.store.dispatch(UnselectElementCompleted());
        });
      } else {
        //todo: edit project
      }
    }));
  }

  newUser() {
    this.dialog.open(UserDialogComponent, {
      data: {mode: UserDialogMode.Create},
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
