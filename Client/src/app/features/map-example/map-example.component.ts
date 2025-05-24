// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MapComponent } from '../../shared/components/map/map.component';
// import { MapMarkerComponent } from '../../shared/components/map/map-marker.component';
// import { MapArrowComponent } from '../../shared/components/map/map-arrow.component';
// import { MapAreaComponent } from '../../shared/components/map/map-area.component';
// import { MapLineComponent } from '../../shared/components/map/map-line.component';
// import {
//   MapOptions,
//   MarkerOptions,
//   ArrowOptions,
//   AreaOptions,
//   LineOptions,
// } from '../../shared/models/leaflet.model';

// @Component({
//   selector: 'app-map-example',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MapComponent,
//     MapMarkerComponent,
//     MapArrowComponent,
//     MapAreaComponent,
//     MapLineComponent,
//   ],
//   template: `
//     <div class="map-container">
//       <app-map [options]="mapOptions">
//         <!-- Komponenty są wyświetlane dopiero po zainicjalizowaniu mapy -->
//       </app-map>

//       <!-- Markery -->
//       <app-map-marker [options]="markerOptions"></app-map-marker>

//       <!-- Strzałka (np. kierunek wiatru) -->
//       <app-map-arrow [options]="arrowOptions"></app-map-arrow>

//       <!-- Obszar na mapie -->
//       <app-map-area [options]="areaOptions"></app-map-area>

//       <!-- Linia na mapie -->
//       <app-map-line [options]="lineOptions"></app-map-line>
//     </div>
//   `,
//   styles: [
//     `
//       .map-container {
//         width: 100%;
//         height: 600px;
//         border: 1px solid #ccc;
//       }
//     `,
//   ],
// })
// export class MapExampleComponent {
//   // Konfiguracja mapy
//   mapOptions: MapOptions = {
//     center: [52.237049, 21.017532], // Warszawa
//     zoom: 10,
//     maxZoom: 18,
//     minZoom: 5,
//   };

//   // Konfiguracja markera
//   markerOptions: MarkerOptions = {
//     position: [52.237049, 21.017532],
//     title: 'Warszawa',
//     draggable: true,
//     onClick: event => {
//       console.log('Kliknięto marker:', event);
//       alert('Kliknięto marker: Warszawa');
//     },
//   };

//   // Konfiguracja strzałki (np. kierunek wiatru)
//   arrowOptions: ArrowOptions = {
//     position: [52.237049, 21.117532],
//     direction: 45, // 45 stopni (północny-wschód)
//     length: 2000, // 2km
//     color: 'blue',
//     weight: 2,
//   };

//   // Konfiguracja obszaru
//   areaOptions: AreaOptions = {
//     positions: [
//       [52.237049, 21.017532],
//       [52.257049, 21.037532],
//       [52.217049, 21.057532],
//     ],
//     color: 'green',
//     fillColor: 'green',
//     fillOpacity: 0.3,
//     onClick: event => {
//       console.log('Kliknięto obszar:', event);
//       alert('Kliknięto obszar');
//     },
//   };

//   // Konfiguracja linii
//   lineOptions: LineOptions = {
//     positions: [
//       [52.2, 20.9],
//       [52.22, 21.0],
//       [52.24, 21.1],
//     ],
//     color: 'red',
//     weight: 3,
//     dashArray: '5, 5',
//   };
// }
