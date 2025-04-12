import { TestBed } from '@angular/core/testing';

import { MatriceService } from './matrice.service';

describe('MatriceService', () => {
  let service: MatriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
