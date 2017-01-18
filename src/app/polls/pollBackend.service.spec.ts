/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PollBackendService } from './pollBackend.service';

describe('PollBackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PollBackendService]
    });
  });

  it('should ...', inject([PollBackendService], (service: PollBackendService) => {
    expect(service).toBeTruthy();
  }));
});
