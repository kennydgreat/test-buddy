import { TestBed } from '@angular/core/testing';

import { AppDataService } from './app-data.service';

describe('UnitsService', () => {
  let service: AppDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDataService);
  });

  it('should be created', () => {
   // expect(service).toBeTruthy();
  });
});
