import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSlotComponent } from './gear-slot.component';

describe('GearSlotComponent', () => {
  let component: GearSlotComponent;
  let fixture: ComponentFixture<GearSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GearSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GearSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
