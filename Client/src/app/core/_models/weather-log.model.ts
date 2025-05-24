export interface WeatherLog {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  sensorId?: string;
  sensorName?: string;
  severity: 'low' | 'medium' | 'high';
  isUserSpecific: boolean;
}

export function isUserSpecificLog(log: WeatherLog): boolean {
  return log.isUserSpecific;
}
