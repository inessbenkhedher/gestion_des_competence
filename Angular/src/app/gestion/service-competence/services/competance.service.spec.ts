import { TestBed } from '@angular/core/testing';

import { CompetanceService } from './competance.service';

describe('CompetanceService', () => {
  let service: CompetanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
