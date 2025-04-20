import { TestBed } from '@angular/core/testing';

import { PostcomptenceService } from './postcomptence.service';

describe('PostcomptenceService', () => {
  let service: PostcomptenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostcomptenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
