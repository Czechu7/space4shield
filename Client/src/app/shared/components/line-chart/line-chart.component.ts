import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';

export interface ChartDataset {
  label?: string;
  data: number[];
  fill?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointRadius?: number;
  borderWidth?: number;
}

export interface CustomChartData {
  labels: string[];
  datasets: ChartDataset[];
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <p-chart 
      type="line" 
      [data]="data" 
      [options]="options"
      [width]="width"
      [height]="height">
    </p-chart>
  `
})
export class LineChartComponent {
  @Input({ required: true }) data!: CustomChartData;
  @Input({ required: true }) options!: ChartOptions;
  @Input() width: string = '100%';
  @Input() height: string = '400px';
}