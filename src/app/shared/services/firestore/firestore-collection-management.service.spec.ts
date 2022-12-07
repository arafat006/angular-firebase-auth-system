import { TestBed } from '@angular/core/testing';

import { FirestoreCollectionManagementService } from './firestore-collection-management.service';

describe('FirestoreCollectionManagementService', () => {
  let service: FirestoreCollectionManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreCollectionManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
