import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWeatherAlertsComponent } from './user-weather-alerts.component';

describe('UserWeatherAlertsComponent', () => {
  let component: UserWeatherAlertsComponent;
  let fixture: ComponentFixture<UserWeatherAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWeatherAlertsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWeatherAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
