import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WeatherLog } from '../../_models/weather-log.model';
import { ILogResponse } from '../../_models/log-response.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherLogsService {
  private generalAlerts: WeatherLog[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      title: 'Solar Storm Warning',
      message: 'A major solar storm is expected to impact Earth in the next 24 hours.',
      severity: 'high',
      isUserSpecific: false,
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      title: 'Geomagnetic Activity',
      message: 'Increased geomagnetic activity detected in the ionosphere.',
      severity: 'medium',
      isUserSpecific: false,
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      title: 'Radiation Level Update',
      message: 'Normal radiation levels recorded in all monitored regions.',
      severity: 'low',
      isUserSpecific: false,
    },
  ];

  private userAlerts: WeatherLog[] = [
    {
      id: '101',
      timestamp: new Date().toISOString(),
      title: 'Sensor Update Required',
      message: 'Your weather sensor WS-1234 needs a firmware update.',
      sensorId: 'WS-1234',
      sensorName: 'Weather Station Alpha',
      severity: 'medium',
      isUserSpecific: true,
    },
    {
      id: '102',
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      title: 'Local Anomaly Detected',
      message: 'Unusual weather pattern detected near your registered location.',
      sensorId: 'WS-1234',
      sensorName: 'Weather Station Alpha',
      severity: 'high',
      isUserSpecific: true,
    },
    {
      id: '103',
      timestamp: new Date(Date.now() - 129600000).toISOString(),
      title: 'Calibration Complete',
      message: 'Your sensor WS-5678 has been successfully calibrated.',
      sensorId: 'WS-5678',
      sensorName: 'Weather Station Beta',
      severity: 'low',
      isUserSpecific: true,
    },
  ];

  getGeneralWeatherAlerts(limit: number, offset: number): Observable<ILogResponse<WeatherLog[]>> {
    console.log(`Service: Getting general alerts with offset=${offset}, limit=${limit}`);

    const data = this.generalAlerts;
    console.log(`Returning ${data.length} general alerts`);
    return of({ data, success: true });
  }

  getUserWeatherAlerts(limit: number, offset: number): Observable<ILogResponse<WeatherLog[]>> {
    console.log(`Service: Getting user alerts with offset=${offset}, limit=${limit}`);

    const data = this.userAlerts;
    console.log(`Returning ${data.length} user alerts`);
    return of({ data, success: true });
  }
}
