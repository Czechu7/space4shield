export enum SensorMetricType {
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  AIR_PRESSURE = 'airPressure',
  PM2_5 = 'pM2_5',
  PM10 = 'pM10',
}

export interface SensorMetricConfig {
  label: string;
  unit: string;
  minValue: number;
  maxValue: number;
  icon?: string;
}

export const SENSOR_METRICS_CONFIG: Record<SensorMetricType, SensorMetricConfig> = {
  [SensorMetricType.TEMPERATURE]: {
    label: 'SENSORS.METRICS.TEMPERATURE',
    unit: '°C',
    minValue: -30,
    maxValue: 60,
    icon: 'pi pi-thermometer',
  },
  [SensorMetricType.HUMIDITY]: {
    label: 'SENSORS.METRICS.HUMIDITY',
    unit: '%',
    minValue: 0,
    maxValue: 100,
    icon: 'pi pi-cloud',
  },
  [SensorMetricType.AIR_PRESSURE]: {
    label: 'SENSORS.METRICS.AIR_PRESSURE',
    unit: 'hPa',
    minValue: 900,
    maxValue: 1100,
    icon: 'pi pi-compass',
  },
  [SensorMetricType.PM2_5]: {
    label: 'SENSORS.METRICS.PM2_5',
    unit: 'μg/m³',
    minValue: 0,
    maxValue: 100,
    icon: 'pi pi-globe',
  },
  [SensorMetricType.PM10]: {
    label: 'SENSORS.METRICS.PM10',
    unit: 'μg/m³',
    minValue: 0,
    maxValue: 150,
    icon: 'pi pi-globe',
  },
};
