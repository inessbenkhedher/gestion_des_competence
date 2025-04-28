import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutcompetenceComponent } from './ajoutcompetence.component';

describe('AjoutcompetenceComponent', () => {
  let component: AjoutcompetenceComponent;
  let fixture: ComponentFixture<AjoutcompetenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutcompetenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutcompetenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
