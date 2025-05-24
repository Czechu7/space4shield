import { inject, Injectable } from '@angular/core';
import { RequestFactoryService } from '../httpRequestFactory/request-factory.service';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../../_models/base-response.model';
import { IUserSensor, IUserSensorResponse, Sensor } from '../../_models/sensor.model';
import { ApiEndpoints } from '../../../enums/api-endpoints.enum';

@Injectable({
  providedIn: 'root',
})
export class UserSensorsService {
  private requestFactory = inject(RequestFactoryService);

  getUserSensors(): Observable<IBaseResponse<IUserSensorResponse>> {
    return this.requestFactory.getAll<IUserSensorResponse>(ApiEndpoints.GET_USER_SENSORS);
  }
}
