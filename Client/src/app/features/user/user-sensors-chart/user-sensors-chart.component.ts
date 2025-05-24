import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ChartOptions } from 'chart.js';
import {
  LineChartComponent,
  CustomChartData,
} from '../../../shared/components/line-chart/line-chart.component';
import { FormService } from '../../../shared/services/form.service';
import { MetricsForm } from '../../../shared/models/form.model';
import { ISensorHistoryItem } from '../../../core/_models/sensor.model';

@Component({
  selector: 'app-user-sensors-chart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LineChartComponent],
  templateUrl: './user-sensors-chart.component.html',
  styleUrl: './user-sensors-chart.component.scss',
})
export class UserSensorsChartComponent implements OnInit {
  @Input() sensorHistory: ISensorHistoryItem[] = [];
  @Input() sensorId!: string;

  metricsForm!: FormGroup<MetricsForm>;
  selectedMetrics: string[] = ['temperature'];

  data: CustomChartData = {
    labels: [],
    datasets: [],
  };

  options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
    },
  };

  availableMetrics = [
    { label: 'Temperature', value: 'temperature', color: '#FF6384' },
    { label: 'Humidity', value: 'humidity', color: '#36A2EB' },
    { label: 'Air Pressure', value: 'airPressure', color: '#FFCE56' },
    { label: 'PM1.0', value: 'pM1_0', color: '#4BC0C0' },
    { label: 'PM2.5', value: 'pM2_5', color: '#9966FF' },
    { label: 'PM10', value: 'pM10', color: '#FF9F40' },
    { label: 'Water Level', value: 'waterLevel', color: '#33CC99' },
    { label: 'Precipitation', value: 'precipitation', color: '#6699FF' },
    { label: 'UV Radiation', value: 'uvRadiation', color: '#FF99CC' },
  ];

  private formService = inject(FormService);

  ngOnInit(): void {
    this.metricsForm = this.formService.getMetricsForm();
    this.metricsForm.valueChanges.subscribe(() => {
      this.onMetricSelectionChange();
    });

    if (this.sensorHistory && this.sensorHistory.length > 0) {
      this.updateChartData();
    }
  }

  get metricsControls() {
    return this.metricsForm.controls;
  }

  onMetricSelectionChange() {
    const formValues = this.metricsForm.value;
    this.selectedMetrics = Object.keys(formValues)
      .filter(key => formValues[key as keyof typeof formValues])
      .map(key => key);

    this.updateChartData();
  }

  updateChartData() {
    if (!this.sensorHistory || this.sensorHistory.length === 0) {
      this.data = {
        labels: [],
        datasets: [],
      };
      return;
    }

    const labels = this.sensorHistory.map(item => new Date(item.readingDateTime).toLocaleString());

    const formValues = this.metricsForm.value;
    const enabledMetrics = Object.keys(formValues).filter(
      key => formValues[key as keyof typeof formValues],
    );

    const datasets = enabledMetrics.map(metric => {
      const metricConfig = this.availableMetrics.find(m => m.value === metric);
      return {
        label: metricConfig?.label || metric,
        data: this.sensorHistory.map(item => {
          const value = item[metric as keyof ISensorHistoryItem];
          return typeof value === 'number' ? value : NaN;
        }),
        fill: false,
        borderColor: metricConfig?.color || '#000000',
        tension: 0.1,
      };
    });

    this.data = { labels, datasets };
  }
}
