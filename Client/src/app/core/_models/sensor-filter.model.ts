import { SensorMetricType } from './sensor-types.enum';

export interface RangeFilter {
  min: number;
  max: number;
  enabled: boolean;
}

export interface SensorFilter {
  enabledMetrics: SensorMetricType[];
  status?: 'all' | 'active' | 'inactive';
}
