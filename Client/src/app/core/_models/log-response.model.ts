import { ILog, IErrorLog } from './log.model';
import { Observable, map } from 'rxjs';
import { WeatherLog } from './weather-log.model';

export interface ILogResponse<T extends ILog[] | IErrorLog[] | WeatherLog[]> {
  data: T;
}

export type ArrayLikeResponse<T> = T[] | unknown;

export function wrapArrayResponse<T extends ILog[] | IErrorLog[]>(): (
  source: Observable<ArrayLikeResponse<T extends (infer U)[] ? U : never>>,
) => Observable<ILogResponse<T>> {
  return (source: Observable<ArrayLikeResponse<T extends (infer U)[] ? U : never>>) =>
    source.pipe(
      map(response => ({ data: Array.isArray(response) ? response : [] }) as ILogResponse<T>),
    );
}
