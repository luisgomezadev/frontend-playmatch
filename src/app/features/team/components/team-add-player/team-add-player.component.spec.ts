import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAddPlayerComponent } from './team-add-player.component';

describe('TeamAddPlayerComponent', () => {
  let component: TeamAddPlayerComponent;
  let fixture: ComponentFixture<TeamAddPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamAddPlayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamAddPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
