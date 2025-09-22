import { 
  Component, 
  OnInit, 
  OnDestroy, 
  signal, 
  computed, 
  effect, 
  DestroyRef, 
  inject,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ApiService } from '../../services/api.service';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { BatteryStatusType } from '../../models/battery-status.model';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexStroke, ApexYAxis } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule], // Direct imports
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Performance optimization
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Modern dependency injection
  private readonly destroyRef = inject(DestroyRef);
  private readonly apiService = inject(ApiService);
  private readonly stateService = inject(DashboardStateService);
  
  // Local UI state signals
  selectedTimeframe = signal(-60); // Default to last hour
  autoRefresh = signal(false);
  
  // Access state service signals
  batteryStatus = this.stateService.batteryStatus;
  telemetryData = this.stateService.telemetryData;
  isLoading = this.stateService.isLoading;
  errorMessage = this.stateService.errorMessage;
  batteryStatusType = this.stateService.batteryStatusType;
  batteryStatusColor = this.stateService.batteryStatusColor;
  
  // Computed signal for chart options
  chartOptions = computed(() => {
    const telemetry = this.telemetryData();
    const batteryPowerData = telemetry['BatteryPowerW'] || [];
    const gridPowerData = telemetry['GridPowerW'] || [];
    
    return {
      series: [
        {
          name: 'Battery Power (W)',
          data: batteryPowerData.map(point => [point.timestamp.getTime(), point.value])
        },
        {
          name: 'Grid Power (W)',
          data: gridPowerData.map(point => [point.timestamp.getTime(), point.value])
        }
      ],
      chart: {
        type: 'line' as const,
        height: 350,
        toolbar: {
          show: true
        }
      },
      stroke: {
        width: 2,
        curve: 'smooth' as const
      },
      colors: ['#009fe3', '#00b140'], 
      xaxis: {
        type: 'datetime' as const
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return val.toFixed(0);
          }
        }
      },
      title: {
        text: 'Battery & Grid Power',
        align: 'left' as const,
        style: {
          color: '#333'
        }
      }
    };
  });

  timeframeOptions = [
    { label: 'Last Hour', value: -60 },
    { label: 'Last Day', value: -1440 },
    { label: 'Last Week', value: -10080 }
  ];

  private refreshInterval?: number;

  constructor() {
    effect(() => {
      if (this.autoRefresh()) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    });

    effect(() => {
      const timeframe = this.selectedTimeframe();
      this.loadTelemetry();
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadData(): void {
    this.loadBatteryStatus();
    this.loadTelemetry();
  }

  loadBatteryStatus(): void {
    this.stateService.setLoading(true);
    this.stateService.clearError();
    
    this.apiService.getBatteryStatus(this.stateService.selectedDeviceId()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (status) => {
        this.stateService.updateBatteryStatus(status);
        this.stateService.setLoading(false);
      },
      error: (error) => {
        this.stateService.handleError(error, 'Load battery status');
      }
    });
  }

  loadTelemetry(): void {
    this.apiService.getTelemetry(this.stateService.selectedDeviceId(), this.selectedTimeframe()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        this.stateService.setTelemetryData(data);
      },
      error: (error) => {
        this.stateService.handleError(error, 'Load telemetry data');
      }
    });
  }

  setTimeframe(value: number): void {
    this.selectedTimeframe.set(value);
  }

  toggleAutoRefresh(): void {
    this.autoRefresh.update(current => !current);
  }

  private startAutoRefresh(): void {
    this.refreshInterval = window.setInterval(() => {
      this.loadData();
    }, 30000);
  }

  private stopAutoRefresh(): void {
    if (this.refreshInterval) {
      window.clearInterval(this.refreshInterval);
    }
  }
}