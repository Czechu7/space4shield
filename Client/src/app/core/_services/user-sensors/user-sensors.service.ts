import { inject, Injectable } from '@angular/core';
import { RequestFactoryService } from '../httpRequestFactory/request-factory.service';
import { Observable } from 'rxjs';
import { IBaseResponse, IBaseResponseWithoutData } from '../../_models/base-response.model';
import {
  INewSensorRequest,
  INewSensorResponse,
  IUserSensorResponse,
  ISensorHistoryResponse,
} from '../../_models/sensor.model';
import { ApiEndpoints } from '../../../enums/api-endpoints.enum';

@Injectable({
  providedIn: 'root',
})
export class UserSensorsService {
  private requestFactory = inject(RequestFactoryService);

  getUserSensors(): Observable<IBaseResponse<IUserSensorResponse>> {
    return this.requestFactory.getAll<IUserSensorResponse>(ApiEndpoints.GET_USER_SENSORS);
  }

  addSensor(sensorData: INewSensorRequest): Observable<IBaseResponse<INewSensorResponse>> {
    return this.requestFactory.post<INewSensorRequest, INewSensorResponse>(
      ApiEndpoints.ADD_SENSOR,
      sensorData,
    );
  }

  deleteSensor(sensorId: string): Observable<IBaseResponseWithoutData> {
    return this.requestFactory.delete<IBaseResponseWithoutData>(
      ApiEndpoints.DELETE_SENSOR,
      sensorId,
    );
  }

  getSensorHistory(sensorId: string): Observable<IBaseResponse<ISensorHistoryResponse>> {
    return this.requestFactory.getById<ISensorHistoryResponse>(
      ApiEndpoints.SENSORS_HISTORY,
      sensorId
    );
  }
}
