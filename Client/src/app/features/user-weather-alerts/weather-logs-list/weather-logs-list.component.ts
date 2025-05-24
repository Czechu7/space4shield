import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WeatherLogItemComponent } from '../../../shared/components/weather-log-item/weather-log-item.component';
import { WeatherLogsService } from '../../../core/_services/weather-logs/weather-logs.service';
import { WeatherLog } from '../../../core/_models/weather-log.model';
import {
  PaginationService,
  PaginationState,
} from '../../../core/_services/pagination/pagination.service';
import { InfiniteScrollDirective } from '../../../shared/directives/infinite-scroll/infinite-scroll.directive';
import { TranslateModule } from '@ngx-translate/core';
import { LogEnum } from '../../../enums/log-type.enum';

@Component({
  selector: 'app-weather-logs-list',
  standalone: true,
  imports: [CommonModule, WeatherLogItemComponent, InfiniteScrollDirective, TranslateModule],
  templateUrl: './weather-logs-list.component.html',
  styleUrl: './weather-logs-list.component.scss',
})
export class WeatherLogsListComponent implements OnInit, OnDestroy {
  @Input() logType: LogEnum = LogEnum.WeatherGeneral;

  LogType = LogEnum;
  logs: WeatherLog[] = [];
  paginationState: PaginationState | null = null;
  private paginationSubscription!: Subscription;

  private logsService = inject(WeatherLogsService);
  private paginationService = inject(PaginationService);

  ngOnInit() {
    this.paginationService.resetPagination();
    this.paginationSubscription = this.paginationService.getPaginationState().subscribe(state => {
      this.paginationState = state;
      if (state.isLoading && !state.reachedEnd) {
        this.loadLogs();
      }
    });

    setTimeout(() => this.paginationService.nextPage(), 0);
  }

  ngOnDestroy() {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

  loadLogs() {
    if (!this.paginationState) return;

    const { limit, offset } = this.paginationState;

    if (this.logType === LogEnum.WeatherGeneral) {
      this.logsService.getGeneralWeatherAlerts(limit, offset).subscribe({
        next: response => {
          if (!response || !response.data) {
            this.paginationService.setLoading(false);
            return;
          }

          if (response.data.length === 0) {
            this.paginationService.setReachedEnd(true);
          } else {
            this.logs = [...this.logs, ...response.data];
          }
          this.paginationService.setLoading(false);
        },
        error: () => {
          this.paginationService.setLoading(false);
        },
      });
    } else {
      this.logsService.getUserWeatherAlerts(limit, offset).subscribe({
        next: response => {
          if (!response || !response.data) {
            this.paginationService.setLoading(false);
            return;
          }

          if (response.data.length === 0) {
            this.paginationService.setReachedEnd(true);
          } else {
            this.logs = [...this.logs, ...response.data];
          }
          this.paginationService.setLoading(false);
        },
        error: () => {
          this.paginationService.setLoading(false);
        },
      });
    }
  }

  onScroll() {
    if (
      this.paginationState &&
      !this.paginationState.isLoading &&
      !this.paginationState.reachedEnd
    ) {
      this.paginationService.nextPage();
    }
  }

  reset() {
    this.logs = [];
    this.paginationService.resetPagination();
    this.paginationService.nextPage();
  }
}
