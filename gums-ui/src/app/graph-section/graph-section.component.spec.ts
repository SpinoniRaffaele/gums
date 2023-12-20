import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphSectionComponent } from './graph-section.component';
import { HttpClient, HttpHandler } from "@angular/common/http";

describe('GraphSectionComponent', () => {
  let component: GraphSectionComponent;
  let fixture: ComponentFixture<GraphSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphSectionComponent],
      providers: [HttpClient, HttpHandler]
    });
    fixture = TestBed.createComponent(GraphSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
