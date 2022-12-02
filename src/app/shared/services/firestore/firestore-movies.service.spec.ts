import { TestBed } from '@angular/core/testing';

import { FirestoreMoviesService } from './firestore-movies.service';

describe('FirestoreMoviesService', () => {
  let service: FirestoreMoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreMoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
