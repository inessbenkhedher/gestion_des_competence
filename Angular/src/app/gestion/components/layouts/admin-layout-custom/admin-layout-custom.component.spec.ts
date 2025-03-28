import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLayoutCustomComponent } from './admin-layout-custom.component';

describe('AdminLayoutCustomComponent', () => {
  let component: AdminLayoutCustomComponent;
  let fixture: ComponentFixture<AdminLayoutCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminLayoutCustomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLayoutCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
