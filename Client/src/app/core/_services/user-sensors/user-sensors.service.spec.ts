import { TestBed } from '@angular/core/testing';

import { UserSensorsService } from './user-sensors.service';

describe('UserSensorsService', () => {
  let service: UserSensorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSensorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
