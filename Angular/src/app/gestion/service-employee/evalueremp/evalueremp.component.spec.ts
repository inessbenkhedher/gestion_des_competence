import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluerempComponent } from './evalueremp.component';

describe('EvaluerempComponent', () => {
  let component: EvaluerempComponent;
  let fixture: ComponentFixture<EvaluerempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluerempComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluerempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
