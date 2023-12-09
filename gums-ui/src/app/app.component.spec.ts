import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GraphSectionComponent } from "./graph-section/graph-section.component";

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponent, GraphSectionComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
