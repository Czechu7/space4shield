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

  sensorFilter: SensorFilter = {
    temperature: {
      min: -20,
      max: 50,
      enabled: true,
    },
    humidity: {
      min: 0,
      max: 100,
      enabled: true,
    },
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
    this.markerOptions = sensors.map(sensor => ({
      position: [sensor.latitude, sensor.longitude],
      title: `${sensor.name}: ${sensor.temperature}°C, ${sensor.humidity}%`,
      onClick: () => this.handleSensorClick(sensor),
    }));
  }

  handleSensorClick(sensor: Sensor): void {
    console.log('Sensor clicked:', sensor);
  }

  applyFilters(): void {
    this.loadSensorData();
  }

  resetFilters(): void {
    this.sensorFilter = {
      temperature: {
        min: -20,
        max: 50,
        enabled: true,
      },
      humidity: {
        min: 0,
        max: 100,
        enabled: true,
      },
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
