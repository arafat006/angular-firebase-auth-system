import { TestBed } from '@angular/core/testing';

import { ContributorGuard } from './contributor.guard';

describe('ContributorGuard', () => {
  let guard: ContributorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ContributorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
