import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCalendarViewComponent } from './reservation-calendar.component';

describe('ReservationCalendarViewComponent', () => {
  let component: ReservationCalendarViewComponent;
  let fixture: ComponentFixture<ReservationCalendarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCalendarViewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReservationCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
