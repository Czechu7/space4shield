import {
  Component,
  AfterViewInit,
  Input,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MapOptions } from '../../models/leaflet.model';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="map-container"></div>',
  styles: [
    `
      .map-container {
        width: 100%;
        height: 100%;
        min-height: 150px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() options: MapOptions = {
    center: [52.237049, 21.017532],
    zoom: 10,
  };

  private map: L.Map | null = null;

  constructor(
    private el: ElementRef,
    private mapService: MapService,
  ) {
    const iconRetinaUrl = 'assets/leaflet/normal_mark.png';
    const iconUrl = 'assets/leaflet/normal_mark.png';
    const shadowUrl = 'assets/leaflet/marker-shadow.png';

    // const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
    // const iconUrl = 'assets/leaflet/marker-icon.png';

    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [24, 24],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.mapService.setMap(null);
    }
  }

  private initMap(): void {
    const container = this.el.nativeElement.querySelector('.map-container');

    this.map = L.map(container, {
      center: this.options.center,
      zoom: this.options.zoom,
      maxZoom: this.options.maxZoom,
      minZoom: this.options.minZoom,
      zoomControl: this.options.zoomControl,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.mapService.setMap(this.map);
  }
}
