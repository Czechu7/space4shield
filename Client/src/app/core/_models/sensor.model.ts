import { SensorMetricType } from './sensor-types.enum';

export interface Sensor {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  metrics: Partial<Record<SensorMetricType, number>>;
}
