import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
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

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartLegend {
  display?: boolean;
  position?: 'top' | 'left' | 'bottom' | 'right';
  labels?: {
    color?: string;
    font?: {
      size?: number;
      family?: string;
    };
  };
}

export interface ChartTooltip {
  enabled?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  bodyColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface ChartScale {
  display?: boolean;
  beginAtZero?: boolean;
  min?: number;
  max?: number;
  ticks?: {
    color?: string;
    font?: {
      size?: number;
      family?: string;
    };
  };
  grid?: {
    display?: boolean;
    color?: string;
  };
}

export interface ChartScales {
  x?: ChartScale;
  y?: ChartScale;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: ChartLegend;
    tooltip?: ChartTooltip;
  };
  scales?: ChartScales;
  elements?: {
    line?: {
      tension?: number;
    };
    point?: {
      radius?: number;
    };
  };
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
  @Input({ required: true }) data!: ChartData;
  @Input({ required: true }) options!: ChartOptions;
  @Input() width: string = '100%';
  @Input() height: string = '400px';
}