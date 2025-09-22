import { TestBed } from '@angular/core/testing';
import { DashboardStateService } from './dashboard-state.service';
import { BatteryStatusType } from '../models/battery-status.model';

describe('DashboardStateService', () => {
  let service: DashboardStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardStateService);
  });

  it('should update battery status signal', () => {
    const mockStatus = { batteryPowerKw: 5.0 } as any;
    
    service.setBatteryStatus(mockStatus);
    
    expect(service.batteryStatus()).toEqual(mockStatus);
  });

  it('should compute battery status type correctly', () => {
    const chargingStatus = { availableDischargePowerKw: 65.0 } as any;
    service.setBatteryStatus(chargingStatus);
    
    expect(service.batteryStatusType()).toBe(BatteryStatusType.PARTIALLY_AVAILABLE);
  });
});