/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PollsListComponent } from './polls-list.component';

describe('PollsListComponent', () => {
  let component: PollsListComponent;
  let fixture: ComponentFixture<PollsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
