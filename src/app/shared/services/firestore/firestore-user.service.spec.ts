import { TestBed } from '@angular/core/testing';

import { FirestoreUsersService } from './firestore-users.service';

describe('FirestoreUsersService', () => {
  let service: FirestoreUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
