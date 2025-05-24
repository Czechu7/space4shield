import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { ArrowOptions } from '../../models/leaflet.model';
import { MapService } from '../../services/map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-arrow',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class MapArrowComponent implements OnInit, OnDestroy {
  @Input() options!: ArrowOptions;

  private arrowMarker: L.Marker | null = null;
  private arrowLine: L.Polyline | null = null;
  private mapSubscription: Subscription | null = null;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.mapSubscription = this.mapService.getMap().subscribe(map => {
      if (map && this.options) {
        this.addArrowToMap(map);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.mapSubscription) {
      this.mapSubscription.unsubscribe();
    }

    this.removeArrow();
  }

  private addArrowToMap(map: L.Map): void {
    const length = this.options.length || 500; // długość strzałki w metrach
    // const radians = (this.options.direction * Math.PI) / 180;

    // Obliczenie końcowego punktu strzałki
    const startPoint = L.latLng(this.options.position);
    const endPoint = this.calculateDestinationPoint(
      startPoint.lat,
      startPoint.lng,
      this.options.direction,
      length,
    );

    // Tworzenie linii strzałki
    this.arrowLine = L.polyline([startPoint, endPoint], {
      color: this.options.color || 'red',
      weight: this.options.weight || 3,
    }).addTo(map);

    // Dodanie znacznika strzałki na końcu linii
    const arrowIcon = L.divIcon({
      html: `<div style="
        transform: rotate(${this.options.direction}deg);
        color: ${this.options.color || 'red'};
        font-size: 20px;
      ">→</div>`,
      className: 'arrow-icon',
      iconSize: [20, 20],
    });

    this.arrowMarker = L.marker(endPoint, { icon: arrowIcon }).addTo(map);
  }

  private calculateDestinationPoint(
    lat: number,
    lng: number,
    bearing: number,
    distance: number,
  ): L.LatLng {
    const R = 6371e3; // Promień Ziemi w metrach
    const d = distance / R; // Kątowa odległość w radianach
    const bearingRad = (bearing * Math.PI) / 180; // Konwersja na radiany

    const lat1 = (lat * Math.PI) / 180;
    const lng1 = (lng * Math.PI) / 180;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(bearingRad),
    );

    const lng2 =
      lng1 +
      Math.atan2(
        Math.sin(bearingRad) * Math.sin(d) * Math.cos(lat1),
        Math.cos(d) - Math.sin(lat1) * Math.sin(lat2),
      );

    return L.latLng((lat2 * 180) / Math.PI, (lng2 * 180) / Math.PI);
  }

  private removeArrow(): void {
    this.mapService.getMap().subscribe(map => {
      if (map) {
        if (this.arrowLine) {
          map.removeLayer(this.arrowLine);
          this.arrowLine = null;
        }

        if (this.arrowMarker) {
          map.removeLayer(this.arrowMarker);
          this.arrowMarker = null;
        }
      }
    });
  }
}
