import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GraphSectionComponent } from './graph-section/graph-section.component';
import { HttpClientModule } from "@angular/common/http";
import { Store, StoreModule } from "@ngrx/store";
import { GRAPH_REDUCER, graphReducer } from "./graph-section/graph.reducer";

@NgModule({
  declarations: [
    AppComponent,
    GraphSectionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({[GRAPH_REDUCER]: graphReducer})
  ],
  providers: [
      HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
