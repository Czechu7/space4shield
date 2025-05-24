import { Injectable } from '@angular/core';
import { MapOptions } from '../../../shared/models/leaflet.model';

const MAP_OPTIONS_KEY = 'map_sensors_options';

@Injectable({
  providedIn: 'root',
})
export class MapConfigService {
  private defaultMapOptions: MapOptions = {
    center: [52.237049, 21.017532], // Warszawa
    zoom: 10,
    maxZoom: 18,
    minZoom: 5,
  };

  getMapOptions(): MapOptions {
    try {
      const savedOptions = localStorage.getItem(MAP_OPTIONS_KEY);
      if (savedOptions) {
        return JSON.parse(savedOptions);
      }
    } catch (error) {
      console.error('Error loading map options from localStorage:', error);
    }

    return this.defaultMapOptions;
  }

  saveMapOptions(options: MapOptions): void {
    try {
      localStorage.setItem(MAP_OPTIONS_KEY, JSON.stringify(options));
    } catch (error) {
      console.error('Error saving map options to localStorage:', error);
    }
  }

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    });
  }

  resetToDefault(): void {
    localStorage.removeItem(MAP_OPTIONS_KEY);
  }
}
