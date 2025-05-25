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
  draggable?: boolean;
  icon?: L.Icon; // Make sure this property exists
  onClick?: () => void;
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

export enum MapIconType {
  DEFAULT = 'default',
  NORMAL = 'normal',
  WATER = 'water',
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  AIR_PRESSURE = 'airPressure',
  PM25 = 'pm25',
  PM10 = 'pm10',
}

export type MapIcons = Record<string, L.Icon>;
