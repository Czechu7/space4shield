export enum SensorMetricType {
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  PRESSURE = 'pressure',
  WIND_SPEED = 'windSpeed',
  AIR_QUALITY = 'airQuality',
  RADIATION = 'radiation',
  LIGHT = 'light',
  SOIL_MOISTURE = 'soilMoisture',
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
    label: 'Temperatura',
    unit: '°C',
    minValue: -30,
    maxValue: 60,
    icon: 'pi pi-thermometer',
  },
  [SensorMetricType.HUMIDITY]: {
    label: 'Wilgotność',
    unit: '%',
    minValue: 0,
    maxValue: 100,
    icon: 'pi pi-cloud',
  },
  [SensorMetricType.PRESSURE]: {
    label: 'Ciśnienie',
    unit: 'hPa',
    minValue: 900,
    maxValue: 1100,
    icon: 'pi pi-compass',
  },
  [SensorMetricType.WIND_SPEED]: {
    label: 'Prędkość wiatru',
    unit: 'km/h',
    minValue: 0,
    maxValue: 200,
    icon: 'pi pi-wind',
  },
  [SensorMetricType.AIR_QUALITY]: {
    label: 'Jakość powietrza',
    unit: 'AQI',
    minValue: 0,
    maxValue: 500,
    icon: 'pi pi-cloud',
  },
  [SensorMetricType.RADIATION]: {
    label: 'Promieniowanie',
    unit: 'μSv/h',
    minValue: 0,
    maxValue: 100,
    icon: 'pi pi-exclamation-triangle',
  },
  [SensorMetricType.LIGHT]: {
    label: 'Oświetlenie',
    unit: 'lux',
    minValue: 0,
    maxValue: 100000,
    icon: 'pi pi-sun',
  },
  [SensorMetricType.SOIL_MOISTURE]: {
    label: 'Wilgotność gleby',
    unit: '%',
    minValue: 0,
    maxValue: 100,
    icon: 'pi pi-water',
  },
};
