import { Component } from '@angular/core';
import { LineChartComponent, CustomChartData } from '../line-chart/line-chart.component';
import { ChartOptions } from 'chart.js';





@Component({
  selector: 'app-line-chart-example',
  standalone: true,
  imports: [LineChartComponent
  ],
  templateUrl: './line-chart-example.component.html',
  styleUrl: './line-chart-example.component.scss'
})
export class ChartLineDemo {


data : CustomChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.1
        },
        {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: '#FFA726',
        tension: 0.1
        }
    ]

    
} 

options : ChartOptions = {
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
            intersect: false
        }
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: false
            }
        },
        y: {
            display: true,
            beginAtZero: true,
            grid: {
                display: true
            }
        }
    }
}

    
}
