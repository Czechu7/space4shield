import { SensorType } from '../../enums/sensor-type.enum';
import { SensorMetricType } from './sensor-types.enum';

export interface Sensor {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  metrics: Partial<Record<SensorMetricType, number>>;
}

export interface IUserSensorResponse {
  items: IUserSensor[];
}

export interface IUserSensor {
  id: string;
  serialNumber: string;
  userId: string;
  street: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;

  temperature?: number;
  humidity?: number;
  airPressure?: number;
  pM1_0?: number;
  pM2_5?: number;
  pM10?: number;
  waterLevel?: number;
  precipitation?: number;
  uvRadiation?: number;

  lastMeasurement: string;
  status: string;
  description: string;
  createdAt: string;
  modifiedAt: string;

  name?: string;
  type?: SensorType;
  value?: number;
  unit?: string;
  location?: string;
  lastUpdate?: Date;
  lastUpdated?: string | Date;
}
