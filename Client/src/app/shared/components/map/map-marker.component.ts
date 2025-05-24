import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MarkerOptions } from '../../models/leaflet.model';
import { MapService } from '../../services/map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-marker',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class MapMarkerComponent implements OnInit, OnDestroy {
  @Input() options!: MarkerOptions;

  private marker: L.Marker | null = null;
  private mapSubscription: Subscription | null = null;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.mapSubscription = this.mapService.getMap().subscribe(map => {
      if (map && this.options) {
        this.addMarkerToMap(map);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.mapSubscription) {
      this.mapSubscription.unsubscribe();
    }

    this.removeMarker();
  }

  private addMarkerToMap(map: L.Map): void {
    const markerOptions: L.MarkerOptions = {
      draggable: this.options.draggable,
    };

    if (this.options.icon) {
      markerOptions.icon = this.options.icon;
    }

    this.marker = L.marker(this.options.position, markerOptions).addTo(map);

    if (this.options.title) {
      this.marker.bindTooltip(this.options.title);
    }

    if (this.options.onClick) {
      this.marker.on('click', this.options.onClick);
    }
  }

  private removeMarker(): void {
    if (this.marker) {
      this.mapService.getMap().subscribe(map => {
        if (map && this.marker) {
          map.removeLayer(this.marker);
          this.marker = null;
        }
      });
    }
  }
}
