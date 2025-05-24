import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SensorFilter } from '../../_models/sensor-filter.model';
import { SensorMetricType } from '../../_models/sensor-types.enum';
import { Sensor } from '../../_models/sensor.model';

@Injectable({
  providedIn: 'root',
})
export class MapSensorsService {
  private apiUrl = '/api/sensors'; // Zastąp rzeczywistym URL API

  constructor(private http: HttpClient) {}

  async getSensors(filter: SensorFilter): Promise<Sensor[]> {
    try {
      // W rzeczywistym projekcie powinno to zostać zastąpione faktycznym wywołaniem API
      // const params = this.buildFilterParams(filter);
      // const response = await firstValueFrom(this.http.get<Sensor[]>(this.apiUrl, { params }));
      // return response;

      // Tymczasowo, generujemy dane testowe
      return this.getMockSensors(filter);
    } catch (error) {
      console.error('Error fetching sensors:', error);
      throw error;
    }
  }

  // Funkcja do generowania testowych danych sensorów
  private getMockSensors(filter: SensorFilter): Sensor[] {
    // Generowanie losowych sensorów wokół Warszawy
    const sensors: Sensor[] = [];
    const centerLat = 52.237049;
    const centerLng = 21.017532;

    for (let i = 0; i < 20; i++) {
      // Losowe przesunięcie w obszarze ±0.1 stopnia
      const latOffset = (Math.random() - 0.5) * 0.2;
      const lngOffset = (Math.random() - 0.5) * 0.2;

      // Tworzymy sensor z wszystkimi możliwymi metrykami
      const metrics: Partial<Record<SensorMetricType, number>> = {};

      // Generowanie wartości dla każdej metryki
      Object.values(SensorMetricType).forEach(metricType => {
        const config = SENSOR_METRICS_CONFIG[metricType];
        // Losowa wartość w zakresie min-max dla danej metryki
        metrics[metricType] =
          Math.floor(Math.random() * (config.maxValue - config.minValue + 1)) + config.minValue;
      });

      // Filtrujemy sensory, które mają przynajmniej jedną z wybranych metryk
      const hasEnabledMetric = filter.enabledMetrics.some(metric => metrics[metric] !== undefined);

      if (hasEnabledMetric) {
        sensors.push({
          id: `sensor-${i}`,
          name: `Sensor ${i + 1}`,
          latitude: centerLat + latOffset,
          longitude: centerLng + lngOffset,
          metrics,
          lastUpdated: new Date().toISOString(),
        });
      }
    }

    return sensors;
  }

  // Dodatkowe metody do obsługi konkretnych sensorów
  async getSensorDetails(sensorId: string): Promise<Sensor> {
    try {
      // W rzeczywistości:
      // return await firstValueFrom(this.http.get<Sensor>(`${this.apiUrl}/${sensorId}`));

      // Tymczasowo zwracamy dane testowe
      const metrics: Partial<Record<SensorMetricType, number>> = {};

      // Generowanie wartości dla każdej metryki
      Object.values(SensorMetricType).forEach(metricType => {
        const config = SENSOR_METRICS_CONFIG[metricType];
        metrics[metricType] =
          Math.floor(Math.random() * (config.maxValue - config.minValue + 1)) + config.minValue;
      });

      return {
        id: sensorId,
        name: `Sensor ${sensorId}`,
        latitude: 52.237049,
        longitude: 21.017532,
        metrics,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error fetching sensor details for ID: ${sensorId}`, error);
      throw error;
    }
  }
}

// Importujemy konfigurację metryk
import { SENSOR_METRICS_CONFIG } from '../../_models/sensor-types.enum';
