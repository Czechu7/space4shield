import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartExampleComponent } from './line-chart-example.component';

describe('LineChartExampleComponent', () => {
  let component: LineChartExampleComponent;
  let fixture: ComponentFixture<LineChartExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineChartExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
