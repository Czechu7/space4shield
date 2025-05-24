export interface RangeFilter {
  min: number;
  max: number;
  enabled: boolean;
}

export interface SensorFilter {
  temperature: RangeFilter;
  humidity: RangeFilter;

  // windSpeed?: RangeFilter;
  // pressure?: RangeFilter;
}
