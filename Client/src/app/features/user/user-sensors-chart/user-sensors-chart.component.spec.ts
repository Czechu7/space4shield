import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSensorsChartComponent } from './user-sensors-chart.component';

describe('UserSensorsChartComponent', () => {
  let component: UserSensorsChartComponent;
  let fixture: ComponentFixture<UserSensorsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSensorsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSensorsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
