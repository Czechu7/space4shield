import { SensorMetricType } from './sensor-types.enum';

export interface Sensor {
  id: string;
  serialNumber: string;
  latitude: number;
  longitude: number;
  status: string;
  lastMeasurement: string;
  createdAt: string;
  temperature: number;
  humidity: number;
  airPressure: number;
  pM2_5: number;
  pM10: number;
  name?: string;
  lastUpdated?: string;
  metrics?: Partial<Record<SensorMetricType, number>>;
}
