/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PollVoteComponent } from './poll-vote.component';

describe('PollVoteComponent', () => {
  let component: PollVoteComponent;
  let fixture: ComponentFixture<PollVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollVoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
