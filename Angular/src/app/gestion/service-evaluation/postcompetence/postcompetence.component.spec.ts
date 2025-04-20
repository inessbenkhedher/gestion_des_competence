import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostcompetenceComponent } from './postcompetence.component';

describe('PostcompetenceComponent', () => {
  let component: PostcompetenceComponent;
  let fixture: ComponentFixture<PostcompetenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostcompetenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostcompetenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
