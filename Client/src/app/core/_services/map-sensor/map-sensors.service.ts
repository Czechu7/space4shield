import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SensorFilter } from '../../_models/sensor-filter.model';
import { Sensor } from '../../_models/sensor.model';

@Injectable({
  providedIn: 'root',
})
export class MapSensorsService {
  private apiUrl = '/api/sensors';

  constructor(private http: HttpClient) {}

  async getSensors(filter: SensorFilter): Promise<Sensor[]> {
    try {
      // request API

      return this.getMockSensors(filter);
    } catch (error) {
      console.error('Error fetching sensors:', error);
      throw error;
    }
  }

  private getMockSensors(filter: SensorFilter): Sensor[] {
    const sensors: Sensor[] = [];
    const centerLat = 52.237049;
    const centerLng = 21.017532;

    for (let i = 0; i < 20; i++) {
      const latOffset = (Math.random() - 0.5) * 0.2;
      const lngOffset = (Math.random() - 0.5) * 0.2;

      const temperature = Math.floor(Math.random() * 60) - 20; // -20 do 40 stopni
      const humidity = Math.floor(Math.random() * 101); // 0-100%

      if (
        filter.temperature.enabled &&
        (temperature < filter.temperature.min || temperature > filter.temperature.max)
      ) {
        continue;
      }

      if (
        filter.humidity.enabled &&
        (humidity < filter.humidity.min || humidity > filter.humidity.max)
      ) {
        continue;
      }

      sensors.push({
        id: `sensor-${i}`,
        name: `Sensor ${i + 1}`,
        latitude: centerLat + latOffset,
        longitude: centerLng + lngOffset,
        temperature,
        humidity,
        lastUpdated: new Date().toISOString(),
      });
    }

    return sensors;
  }

  async getSensorDetails(sensorId: string): Promise<Sensor> {
    try {
      return {
        id: sensorId,
        name: `Sensor ${sensorId}`,
        latitude: 52.237049,
        longitude: 21.017532,
        temperature: 25,
        humidity: 60,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error fetching sensor details for ID: ${sensorId}`, error);
      throw error;
    }
  }
}
