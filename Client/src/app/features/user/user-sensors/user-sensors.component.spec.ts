import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSensorsComponent } from './user-sensors.component';

describe('UserSensorsComponent', () => {
  let component: UserSensorsComponent;
  let fixture: ComponentFixture<UserSensorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSensorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSensorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
