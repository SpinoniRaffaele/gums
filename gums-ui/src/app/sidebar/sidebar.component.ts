import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent, UserDialogMode } from '../dialog/user-dialog/user-dialog.component';
import { Store } from '@ngrx/store';
import { selectSelectedUser } from '../graph-section/graph.reducer';
import { FullUser } from '../graph-section/graph-utils/graph.datamodel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnDestroy {

  selectedUser: FullUser;
  subscriptions: Subscription[] = [];
  
  constructor(
    private loginService: AuthService,
    private dialog: MatDialog,
    private store: Store
  ) {
    this.subscriptions.push(this.store.select(selectSelectedUser).subscribe((user: FullUser) => {
      if (user !== this.selectedUser) {
        this.selectedUser = user;
        if (user) {
          this.dialog.open(UserDialogComponent, {
            data: {mode: UserDialogMode.Edit, user: this.selectedUser},
            minWidth: '30%'
          });
        }
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
