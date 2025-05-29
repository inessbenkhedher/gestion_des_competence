import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieElementComponent } from './saisie-element.component';

describe('SaisieElementComponent', () => {
  let component: SaisieElementComponent;
  let fixture: ComponentFixture<SaisieElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaisieElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaisieElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
