import { TestBed } from '@angular/core/testing';

import { FirebaseErrorNormalizeService } from './firebase-error-normalize.service';

describe('FirebaseErrorNormalizeService', () => {
  let service: FirebaseErrorNormalizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseErrorNormalizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
