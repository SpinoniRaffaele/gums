import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { provideMockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogMode } from '../dialog/user-dialog/user-dialog.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  const mockAuthService = { logout: jest.fn(), login: jest.fn() };
  const mockMatDialog = { open: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: AuthService, useValue: mockAuthService},
        provideMockStore(),
        {provide: MatDialog, useValue: mockMatDialog}
      ]
    });
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should correctly logout', () => {
    jest.spyOn(mockAuthService, 'logout');
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should correctly open a dialog for a new user', () => {
    jest.spyOn(mockMatDialog, 'open');
    component.newUser();

    expect(mockMatDialog.open).toHaveBeenCalledWith(expect.anything(), {
      data: {mode: UserDialogMode.Create},
      minWidth: '30%'
    });
  });
});
