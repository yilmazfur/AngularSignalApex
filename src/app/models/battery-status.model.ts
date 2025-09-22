export interface BatteryStatus {
  logTime: string;
  batteryEnergyLifetimeImportKwh: number;
  batteryEnergyLifetimeExportKwh: number;
  batteryPowerKw: number;
  batteryPowerSetpointKw: number;
  cycleCountDay: number;
  cycleCountYtd: number;
  cycleCountLifetime: number;
  availableChargePowerKw: number;
  availableDischargePowerKw: number;
  chargeCapacityRemainingKwh: number;
}

export enum BatteryStatusType {
  OK = 'OK',
  PARTIALLY_AVAILABLE = 'Partially Available',
  NOT_AVAILABLE = 'Not Available'
}