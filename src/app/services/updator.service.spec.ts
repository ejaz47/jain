import { TestBed } from '@angular/core/testing';

import { UpdatorService } from './updator.service';

describe('UpdatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdatorService = TestBed.get(UpdatorService);
    expect(service).toBeTruthy();
  });
});
