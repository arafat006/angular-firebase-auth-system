import { TestBed } from '@angular/core/testing';

import { FormErrorNormalizeService } from './form-error-normalize.service';

describe('FormErrorNormalizeService', () => {
  let service: FormErrorNormalizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormErrorNormalizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
