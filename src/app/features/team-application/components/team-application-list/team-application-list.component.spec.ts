import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamApplicationListComponent } from './team-application-list.component';

describe('TeamApplicationListComponent', () => {
  let component: TeamApplicationListComponent;
  let fixture: ComponentFixture<TeamApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamApplicationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
