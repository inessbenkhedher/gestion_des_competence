import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompetancesComponent } from './list-competances.component';

describe('ListCompetancesComponent', () => {
  let component: ListCompetancesComponent;
  let fixture: ComponentFixture<ListCompetancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCompetancesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCompetancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
