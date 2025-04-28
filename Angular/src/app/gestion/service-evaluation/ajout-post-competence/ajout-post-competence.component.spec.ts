import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutPostCompetenceComponent } from './ajout-post-competence.component';

describe('AjoutPostCompetenceComponent', () => {
  let component: AjoutPostCompetenceComponent;
  let fixture: ComponentFixture<AjoutPostCompetenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutPostCompetenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutPostCompetenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
