import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GearGoalsComponent } from './gear-goals.component';

describe('GearGoalsComponent', () => {
  let component: GearGoalsComponent;
  let fixture: ComponentFixture<GearGoalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GearGoalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GearGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
