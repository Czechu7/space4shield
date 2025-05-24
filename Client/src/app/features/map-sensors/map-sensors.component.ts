import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../../shared/components/map/map.component';
import { MapMarkerComponent } from '../../shared/components/map/map-marker.component';
import { MapArrowComponent } from '../../shared/components/map/map-arrow.component';
import { MapAreaComponent } from '../../shared/components/map/map-area.component';
import { MapLineComponent } from '../../shared/components/map/map-line.component';
import {
  MapOptions,
  MarkerOptions,
  ArrowOptions,
  AreaOptions,
  LineOptions,
} from '../../shared/models/leaflet.model';
import { MapConfigService } from '../../core/_services/map-config/map-config.service';
import { SensorFilter } from '../../core/_models/sensor-filter.model';
import { MapSensorsService } from '../../core/_services/map-sensor/map-sensors.service';
import { Sensor } from '../../core/_models/sensor.model';
import { SensorFiltersComponent } from './sensor-filters/sensor-filters.component';
import { SENSOR_METRICS_CONFIG, SensorMetricType } from '../../core/_models/sensor-types.enum';

@Component({
  selector: 'app-map-sensors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MapComponent,
    MapMarkerComponent,
    MapArrowComponent,
    MapAreaComponent,
    MapLineComponent,
    SensorFiltersComponent,
  ],
  templateUrl: './map-sensors.component.html',
  styleUrls: ['./map-sensors.component.scss'],
})
export class MapSensorsComponent implements OnInit {
  mapOptions: MapOptions;
  markerOptions: MarkerOptions[] = [];
  arrowOptions: ArrowOptions[] = [];
  areaOptions: AreaOptions[] = [];
  lineOptions: LineOptions[] = [];

  // Aktualizacja modelu filtrów
  sensorFilter: SensorFilter = {
    enabledMetrics: Object.values(SensorMetricType),
  };

  constructor(
    private mapSensorsService: MapSensorsService,
    private mapConfigService: MapConfigService,
  ) {
    this.mapOptions = this.mapConfigService.getMapOptions();
  }

  ngOnInit(): void {
    this.loadSensorData();
  }

  async loadSensorData(): Promise<void> {
    try {
      const sensors = await this.mapSensorsService.getSensors(this.sensorFilter);
      this.updateMapElements(sensors);
    } catch (error) {
      console.error('Failed to load sensor data:', error);
    }
  }

  updateMapElements(sensors: Sensor[]): void {
    // Konwersja danych sensorów na elementy mapy (markery)
    this.markerOptions = sensors.map(sensor => {
      // Tworzymy opis sensora na podstawie dostępnych metryk
      const tooltipParts: string[] = [];

      // Dodajemy informacje o każdej dostępnej metryce
      this.sensorFilter.enabledMetrics.forEach(metricType => {
        if (sensor.metrics[metricType] !== undefined) {
          const config = SENSOR_METRICS_CONFIG[metricType];
          tooltipParts.push(`${config.label}: ${sensor.metrics[metricType]}${config.unit}`);
        }
      });

      const tooltipContent = tooltipParts.join(', ');

      return {
        position: [sensor.latitude, sensor.longitude],
        title: `${sensor.name}: ${tooltipContent}`,
        onClick: () => this.handleSensorClick(sensor),
      };
    });
  }

  handleSensorClick(sensor: Sensor): void {
    console.log('Sensor clicked:', sensor);
    // Tutaj możesz dodać kod do wyświetlania szczegółów sensora
  }

  onFilterChange(filter: SensorFilter): void {
    this.sensorFilter = filter;
    this.loadSensorData();
  }

  onResetFilters(): void {
    this.sensorFilter = {
      enabledMetrics: Object.values(SensorMetricType),
    };
    this.loadSensorData();
  }

  useCurrentLocation(): void {
    this.mapConfigService
      .getCurrentPosition()
      .then(position => {
        this.mapOptions = {
          ...this.mapOptions,
          center: [position.coords.latitude, position.coords.longitude],
          zoom: 14,
        };
        this.mapConfigService.saveMapOptions(this.mapOptions);
      })
      .catch(error => {
        console.error('Error getting current position:', error);
      });
  }
}
