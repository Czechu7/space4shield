import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { AreaOptions } from '../../models/leaflet.model';
import { MapService } from '../../services/map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-area',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class MapAreaComponent implements OnInit, OnDestroy {
  @Input() options!: AreaOptions;

  private area: L.Polygon | null = null;
  private mapSubscription: Subscription | null = null;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.mapSubscription = this.mapService.getMap().subscribe(map => {
      if (map && this.options) {
        this.addAreaToMap(map);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.mapSubscription) {
      this.mapSubscription.unsubscribe();
    }

    this.removeArea();
  }

  private addAreaToMap(map: L.Map): void {
    this.area = L.polygon(this.options.positions, {
      color: this.options.color || '#3388ff',
      fillColor: this.options.fillColor || '#3388ff',
      fillOpacity: this.options.fillOpacity !== undefined ? this.options.fillOpacity : 0.2,
    }).addTo(map);

    if (this.options.onClick) {
      this.area.on('click', this.options.onClick);
    }
  }

  private removeArea(): void {
    if (this.area) {
      this.mapService.getMap().subscribe(map => {
        if (map && this.area) {
          map.removeLayer(this.area);
          this.area = null;
        }
      });
    }
  }
}
