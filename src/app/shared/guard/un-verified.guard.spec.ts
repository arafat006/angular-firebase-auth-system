import { TestBed } from '@angular/core/testing';

import { UnVerifiedGuard } from './un-verified.guard';

describe('UnVerifiedGuard', () => {
  let guard: UnVerifiedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UnVerifiedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
