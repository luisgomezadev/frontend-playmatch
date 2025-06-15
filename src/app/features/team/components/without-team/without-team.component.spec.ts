import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutTeamComponent } from './without-team.component';

describe('WithoutTeamComponent', () => {
  let component: WithoutTeamComponent;
  let fixture: ComponentFixture<WithoutTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithoutTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WithoutTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
