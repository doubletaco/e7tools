import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSearchItemComponent } from './hero-search-item.component';

describe('HeroSearchItemComponent', () => {
  let component: HeroSearchItemComponent;
  let fixture: ComponentFixture<HeroSearchItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroSearchItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroSearchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
