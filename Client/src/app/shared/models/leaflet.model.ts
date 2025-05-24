import * as L from 'leaflet';

export interface MapOptions {
  center: [number, number];
  zoom: number;
  maxZoom?: number;
  minZoom?: number;
  zoomControl?: boolean;
}

export interface MarkerOptions {
  position: [number, number];
  title?: string;
  icon?: L.Icon | L.DivIcon;
  draggable?: boolean;
  onClick?: (event: L.LeafletMouseEvent) => void;
}

export interface ArrowOptions {
  position: [number, number];
  direction: number;
  length?: number;
  color?: string;
  weight?: number;
}

export interface AreaOptions {
  positions: [number, number][];
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  onClick?: (event: L.LeafletMouseEvent) => void;
}

export interface LineOptions {
  positions: [number, number][];
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
}
