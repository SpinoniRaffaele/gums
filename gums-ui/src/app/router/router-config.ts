import { LoginComponent } from '../login/login.component';
import { AuthGuard } from './auth.guard';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'login'}
];