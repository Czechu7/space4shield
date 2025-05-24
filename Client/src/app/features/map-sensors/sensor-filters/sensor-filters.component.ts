import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SensorFilter } from '../../../core/_models/sensor-filter.model';
import { SENSOR_METRICS_CONFIG, SensorMetricType } from '../../../core/_models/sensor-types.enum';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-sensor-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ButtonComponent],
  templateUrl: './sensor-filters.component.html',
  styleUrls: ['./sensor-filters.component.scss'],
})
export class SensorFiltersComponent implements OnInit {
  @Input() filter: SensorFilter = { enabledMetrics: [] };
  @Output() filterChange = new EventEmitter<SensorFilter>();
  @Output() resetFilters = new EventEmitter<void>();
  @Output() useCurrentLocation = new EventEmitter<void>();

  sensorMetricTypes = Object.values(SensorMetricType);
  sensorMetricsConfig = SENSOR_METRICS_CONFIG;

  ngOnInit(): void {
    if (!this.filter.enabledMetrics || this.filter.enabledMetrics.length === 0) {
      this.filter.enabledMetrics = [...this.sensorMetricTypes];
    }
  }

  isMetricEnabled(metricType: SensorMetricType): boolean {
    return this.filter.enabledMetrics.includes(metricType);
  }

  toggleMetric(metricType: SensorMetricType, isChecked: boolean): void {
    console.log('Toggle metric:', metricType, 'isChecked:', isChecked);

    if (isChecked) {
      if (!this.isMetricEnabled(metricType)) {
        this.filter.enabledMetrics = [...this.filter.enabledMetrics, metricType];
      }
    } else {
      this.filter.enabledMetrics = this.filter.enabledMetrics.filter(m => m !== metricType);
    }

    this.applyFilters();
  }

  applyFilters(): void {
    console.log('Applying filters:', this.filter);
    this.filterChange.emit(this.filter);
  }

  onResetFilters(): void {
    this.filter.enabledMetrics = [...this.sensorMetricTypes];
    this.resetFilters.emit();
    this.filterChange.emit(this.filter);
  }

  onUseCurrentLocation(): void {
    this.useCurrentLocation.emit();
  }
}
