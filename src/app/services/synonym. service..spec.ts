import { TestBed } from '@angular/core/testing';

import { SynonymService } from './synonym.service';

describe('Synonym', () => {
  let service: SynonymService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynonymService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
