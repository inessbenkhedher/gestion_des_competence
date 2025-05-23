import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAnalyseComponent } from './dashboard-analyse.component';

describe('DashboardAnalyseComponent', () => {
  let component: DashboardAnalyseComponent;
  let fixture: ComponentFixture<DashboardAnalyseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAnalyseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAnalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
