export interface Sensor {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  lastUpdated: string;
}
