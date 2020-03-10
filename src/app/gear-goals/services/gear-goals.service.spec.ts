import { TestBed } from '@angular/core/testing';

import { GearGoalsService } from './gear-goals.service';

describe('GearGoalsService', () => {
  let service: GearGoalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GearGoalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
