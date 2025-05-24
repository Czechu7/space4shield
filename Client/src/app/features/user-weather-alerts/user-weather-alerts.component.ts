import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LogEnum } from '../../enums/log-type.enum';
import { WeatherLogsListComponent } from './weather-logs-list/weather-logs-list.component';

@Component({
  selector: 'app-user-weather-alerts',
  standalone: true,
  imports: [CommonModule, WeatherLogsListComponent, TranslateModule],
  templateUrl: './user-weather-alerts.component.html',
  styleUrl: './user-weather-alerts.component.scss',
})
export class UserWeatherAlertsComponent {
  LogType = LogEnum;
  currentTab: LogEnum = LogEnum.WeatherGeneral;

  switchTab(tab: LogEnum): void {
    this.currentTab = tab;
  }
}
