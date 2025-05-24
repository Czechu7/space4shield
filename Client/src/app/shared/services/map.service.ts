import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapInstance = new BehaviorSubject<L.Map | null>(null);

  setMap(map: L.Map | null): void {
    this.mapInstance.next(map);
  }

  getMap(): Observable<L.Map | null> {
    return this.mapInstance.asObservable();
  }

  clearMap(): void {
    const map = this.mapInstance.getValue();
    if (map) {
      map.eachLayer(layer => {
        if (layer instanceof L.TileLayer === false) {
          map.removeLayer(layer);
        }
      });
    }
  }
}
