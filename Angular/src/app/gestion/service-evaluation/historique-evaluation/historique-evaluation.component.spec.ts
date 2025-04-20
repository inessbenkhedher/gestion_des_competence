import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueEvaluationComponent } from './historique-evaluation.component';

describe('HistoriqueEvaluationComponent', () => {
  let component: HistoriqueEvaluationComponent;
  let fixture: ComponentFixture<HistoriqueEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueEvaluationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
