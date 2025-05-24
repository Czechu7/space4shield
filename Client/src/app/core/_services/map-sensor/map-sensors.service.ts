import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiEndpoints } from '../../../enums/api-endpoints.enum';
import { SensorFilter } from '../../_models/sensor-filter.model';
import { Sensor } from '../../_models/sensor.model';
import { RequestFactoryService } from '../httpRequestFactory/request-factory.service';

@Injectable({
  providedIn: 'root',
})
export class MapSensorsService {
  constructor(private requestFactory: RequestFactoryService) {}

  async getSensors(filter: SensorFilter): Promise<Sensor[]> {
    try {
      // Use the real API endpoint
      const response = await firstValueFrom(
        this.requestFactory.get<Sensor[]>(ApiEndpoints.SENSORS),
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching sensors:', error);
      // If the API fails, fallback to mock data for development
      return this.getMockSensors(filter);
    }
  }

  // Fallback mock data generator
  private getMockSensors(filter: SensorFilter): Sensor[] {
    const sensors: Sensor[] = [];
    const centerLat = 52.237049;
    const centerLng = 21.017532;

    for (let i = 0; i < 20; i++) {
      const latOffset = (Math.random() - 0.5) * 0.2;
      const lngOffset = (Math.random() - 0.5) * 0.2;

      const sensor: Sensor = {
        id: `sensor-${i}`,
        serialNumber: `SN-${i + 1000}`,
        latitude: centerLat + latOffset,
        longitude: centerLng + lngOffset,
        status: Math.random() > 0.2 ? 'Active' : 'Inactive',
        lastMeasurement: new Date().toISOString(),
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        temperature: Math.floor(Math.random() * 40) - 10,
        humidity: Math.floor(Math.random() * 100),
        airPressure: Math.floor(Math.random() * 200) + 900,
        pM2_5: Math.floor(Math.random() * 100),
        pM10: Math.floor(Math.random() * 150),
      };

      // Check if sensor has at least one enabled metric
      const hasEnabledMetric = filter.enabledMetrics.some(
        metricType => sensor[metricType as keyof Sensor] !== undefined,
      );

      if (hasEnabledMetric) {
        sensors.push(sensor);
      }
    }

    return sensors;
  }

  async getSensorDetails(sensorId: string): Promise<Sensor> {
    try {
      const response = await firstValueFrom(
        this.requestFactory.getById<Sensor>(ApiEndpoints.SENSORS, sensorId),
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching sensor details for ID: ${sensorId}`, error);

      // Return mock data if the API call fails
      return {
        id: sensorId,
        serialNumber: `SN-${sensorId}`,
        latitude: 52.237049,
        longitude: 21.017532,
        status: 'Active',
        lastMeasurement: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        temperature: Math.floor(Math.random() * 40) - 10,
        humidity: Math.floor(Math.random() * 100),
        airPressure: Math.floor(Math.random() * 200) + 900,
        pM2_5: Math.floor(Math.random() * 100),
        pM10: Math.floor(Math.random() * 150),
      };
    }
  }
}
