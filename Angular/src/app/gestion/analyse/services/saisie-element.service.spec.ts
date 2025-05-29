import { TestBed } from '@angular/core/testing';

import { SaisieElementService } from './saisie-element.service';

describe('SaisieElementService', () => {
  let service: SaisieElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaisieElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
