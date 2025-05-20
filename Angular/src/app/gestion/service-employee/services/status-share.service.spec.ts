import { TestBed } from '@angular/core/testing';

import { StatusShareService } from './status-share.service';

describe('StatusShareService', () => {
  let service: StatusShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
