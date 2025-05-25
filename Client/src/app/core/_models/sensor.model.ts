import { SensorType } from '../../enums/sensor-type.enum';
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

export interface IUserSensorResponse {
  items: IUserSensor[];
}

export interface INewSensorRequest {
  serialNumber: string;
  street: string;
  city: string;
  description: string;
  postalCode: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface INewSensorResponse {}

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

export interface ISensorHistoryResponse {
  items: ISensorHistoryItem[];
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface ISensorHistoryItem {
  id: string;
  sensorId: string;
  readingDateTime: string;
  temperature: number;
  humidity: number;
  airPressure: number;
  pM1_0: number;
  pM2_5: number;
  pM10: number;
  waterLevel: number;
  precipitation: number;
  uvRadiation: number;
  readingSource: string;
  isValid: boolean;
  createdAt: string;
}
