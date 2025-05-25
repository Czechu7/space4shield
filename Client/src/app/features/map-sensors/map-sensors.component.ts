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
  MapIconType,
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
    // Convert sensor data to map markers
    this.markerOptions = sensors.map(sensor => {
      // Create description based on available metrics
      const tooltipParts: string[] = [];

      // Add information for each available metric
      this.sensorFilter.enabledMetrics.forEach(metricType => {
        const value = sensor[metricType as keyof Sensor];
        if (value !== undefined && typeof value === 'number') {
          const config = SENSOR_METRICS_CONFIG[metricType];
          tooltipParts.push(`${config.label}: ${value}${config.unit}`);
        }
      });

      // Add status and last measurement time
      tooltipParts.push(`Status: ${sensor.status}`);
      const lastMeasurementDate = new Date(sensor.lastMeasurement);
      tooltipParts.push(`Last updated: ${lastMeasurementDate.toLocaleString()}`);

      const tooltipContent = tooltipParts.join(', ');
      const displayName = sensor.serialNumber || `Sensor ${sensor.id}`;

      // Determine icon type based on sensor metrics
      let iconType = MapIconType.DEFAULT;

      if (sensor.humidity !== undefined && sensor.humidity > 80) {
        iconType = MapIconType.WATER;
      } else if (sensor.temperature !== undefined) {
        iconType = MapIconType.TEMPERATURE;
      } else {
        iconType = MapIconType.NORMAL;
      }

      return {
        position: [sensor.latitude, sensor.longitude],
        title: `${displayName}: ${tooltipContent}`,
        onClick: () => this.handleSensorClick(sensor),
        iconType: iconType, // Add icon type to marker options
      };
    });
  }

  handleSensorClick(sensor: Sensor): void {
    console.log('Sensor clicked:', sensor);
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
