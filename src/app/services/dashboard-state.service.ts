import { Injectable, signal, computed } from '@angular/core';
import { BatteryStatus, BatteryStatusType } from '../models/battery-status.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  // Core state signals
  private _batteryStatus = signal<BatteryStatus | null>(null);
  private _telemetryData = signal<Record<string, { timestamp: Date; value: number }[]>>({});
  private _selectedDeviceId = signal('23.32.003');
  private _isLoading = signal(false);
  private _errorMessage = signal('');
  private _lastUpdated = signal<Date | null>(null);

  // Read-only public signals
  readonly batteryStatus = this._batteryStatus.asReadonly();
  readonly telemetryData = this._telemetryData.asReadonly();
  readonly selectedDeviceId = this._selectedDeviceId.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly lastUpdated = this._lastUpdated.asReadonly();

  // Computed signals for derived state
  readonly batteryStatusType = computed(() => {
    const status = this._batteryStatus();
    if (!status) return BatteryStatusType.NOT_AVAILABLE;
    
    const { availableDischargePowerKw } = status;
    if (availableDischargePowerKw > 100) {
      return BatteryStatusType.OK;
    } else if (availableDischargePowerKw > 50) {
      return BatteryStatusType.PARTIALLY_AVAILABLE;
    } else {
      return BatteryStatusType.NOT_AVAILABLE;
    }
  });

  readonly batteryStatusColor = computed(() => {
    switch (this.batteryStatusType()) {
      case BatteryStatusType.OK:
        return '#00A651'; // green
      case BatteryStatusType.PARTIALLY_AVAILABLE:
        return '#009fe3'; // blue  
      case BatteryStatusType.NOT_AVAILABLE:
        return '#e74c3c'; // Red
      default:
        return '#6c757d'; // Gray
    }
  });

  readonly batteryPercentage = computed(() => {
    const status = this._batteryStatus();
    if (!status) return 0;
    
    // Simple percentage calculation
    const maxCapacity = status.availableChargePowerKw + status.availableDischargePowerKw;
    if (maxCapacity === 0) return 0;
    
    return Math.round((status.chargeCapacityRemainingKwh / maxCapacity) * 100);
  });

  // State update methods
  setBatteryStatus(status: BatteryStatus | null): void {
    this._batteryStatus.set(status);
    this._lastUpdated.set(new Date());
  }

  setTelemetryData(data: Record<string, { timestamp: Date; value: number }[]>): void {
    this._telemetryData.set(data);
  }

  setDeviceId(deviceId: string): void {
    this._selectedDeviceId.set(deviceId);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  setError(message: string): void {
    this._errorMessage.set(message);
  }

  clearError(): void {
    this._errorMessage.set('');
  }

  // Helper method to update battery status with error handling
  updateBatteryStatus(status: BatteryStatus): void {
    this.clearError();
    this.setBatteryStatus(status);
  }

  // Helper method to handle errors
  handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
    this.setError(`Failed to ${context.toLowerCase()}. Please try again.`);
    this.setLoading(false);
  }
}
