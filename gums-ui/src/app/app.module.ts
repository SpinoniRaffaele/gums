import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GraphSectionComponent } from './graph-section/graph-section.component';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    GraphSectionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
      HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
