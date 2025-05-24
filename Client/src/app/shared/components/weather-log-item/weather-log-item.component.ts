import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { WeatherLog, isUserSpecificLog } from '../../../core/_models/weather-log.model';
import { RouterEnum } from '../../../enums/router.enum';

@Component({
  selector: 'app-weather-log-item',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './weather-log-item.component.html',
  styleUrl: './weather-log-item.component.scss',
})
export class WeatherLogItemComponent {
  @Input() log!: WeatherLog;
  @Input() isUserSpecific = false;

  RouterEnum = RouterEnum;
  isUserSpecificLog = isUserSpecificLog;
  private router = inject(Router);

  showDetails() {
    this.router.navigate([RouterEnum.logs, this.log.id]);
  }
}
