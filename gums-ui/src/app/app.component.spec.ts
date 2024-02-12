import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GraphSectionComponent } from "./graph-section/graph-section.component";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { provideMockStore } from '@ngrx/store/testing';
import { SidebarComponent } from './sidebar/sidebar.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponent, GraphSectionComponent, SidebarComponent],
    providers: [HttpClient, HttpHandler, provideMockStore()]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
