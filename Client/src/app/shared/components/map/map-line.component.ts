import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { LineOptions } from '../../models/leaflet.model';
import { MapService } from '../../services/map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-line',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class MapLineComponent implements OnInit, OnDestroy {
  @Input() options!: LineOptions;

  private line: L.Polyline | null = null;
  private mapSubscription: Subscription | null = null;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.mapSubscription = this.mapService.getMap().subscribe(map => {
      if (map && this.options) {
        this.addLineToMap(map);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.mapSubscription) {
      this.mapSubscription.unsubscribe();
    }

    this.removeLine();
  }

  private addLineToMap(map: L.Map): void {
    this.line = L.polyline(this.options.positions, {
      color: this.options.color || '#3388ff',
      weight: this.options.weight || 3,
      opacity: this.options.opacity || 1,
      dashArray: this.options.dashArray,
    }).addTo(map);
  }

  private removeLine(): void {
    if (this.line) {
      this.mapService.getMap().subscribe(map => {
        if (map && this.line) {
          map.removeLayer(this.line);
          this.line = null;
        }
      });
    }
  }
}
