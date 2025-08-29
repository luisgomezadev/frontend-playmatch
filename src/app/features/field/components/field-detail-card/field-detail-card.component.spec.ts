import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldDetailCardComponent } from './field-detail-card.component';

describe('FieldDetailCardComponent', () => {
  let component: FieldDetailCardComponent;
  let fixture: ComponentFixture<FieldDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldDetailCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FieldDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
