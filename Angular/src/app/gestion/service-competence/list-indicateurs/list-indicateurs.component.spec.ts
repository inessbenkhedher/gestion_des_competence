import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIndicateursComponent } from './list-indicateurs.component';

describe('ListIndicateursComponent', () => {
  let component: ListIndicateursComponent;
  let fixture: ComponentFixture<ListIndicateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListIndicateursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListIndicateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
