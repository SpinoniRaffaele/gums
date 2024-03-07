import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GraphSectionComponent } from './graph-section/graph-section.component';
import { HttpClientModule } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { GRAPH_REDUCER, graphReducer } from "./graph-section/graph.reducer";
import { SidebarComponent } from './sidebar/sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { LoginComponent } from './login/login.component';
import { routes } from './router/router-config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    GraphSectionComponent,
    SidebarComponent,
    AdminPanelComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({[GRAPH_REDUCER]: graphReducer}),
    RouterModule.forRoot(routes),
    MatSlideToggleModule,
    MatFormField,
    MatInputModule,
    MatLabel,
    MatIcon,
    MatButton,
    MatCard
  ],
  providers: [
      HttpClientModule,
      provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
