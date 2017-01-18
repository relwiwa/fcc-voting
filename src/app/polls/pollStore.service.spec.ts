/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PollStore } from './pollStore.service';

describe('PollFrontendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PollStore]
    });
  });

  it('should ...', inject([PollStore], (service: PollStore) => {
    expect(service).toBeTruthy();
  }));
});
