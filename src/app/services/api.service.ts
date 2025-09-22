import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, timeout } from 'rxjs';
import { BatteryStatus } from '../models/battery-status.model';
import { TelemetryApiResponse, parseTelemetryResponse } from '../models/telemetry-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.api.baseUrl;

  constructor(private http: HttpClient) {
    if (environment.features.enableDebugLogs) {
      console.log('API Service initialized with environment:', {
        baseUrl: this.baseUrl,
        timeout: environment.api.timeout,
        retryAttempts: environment.api.retryAttempts
      });
    }
  }

  getBatteryStatus(deviceId: string = 'DEVICE123'): Observable<BatteryStatus> {
    const headers = this.getHeaders();
    
    if (environment.features.enableDebugLogs) {
      console.log('Fetching battery status for device:', deviceId);
    }

    return this.http.get<BatteryStatus>(
      `${this.baseUrl}/v1/batteries/${deviceId}/status`,
      { headers }
    ).pipe(
      timeout(environment.api.timeout)
    );
  }

  getTelemetry(deviceId: string = 'DEVICE123', offsetMinutes: number): Observable<Record<string, { timestamp: Date; value: number }[]>> {
    const headers = this.getHeaders();
    
    if (environment.features.enableDebugLogs) {
      console.log('Fetching telemetry data:', { deviceId, offsetMinutes });
    }

    return this.http.get<TelemetryApiResponse>(
      `${this.baseUrl}/v1/batteries/${deviceId}/telemetry?OffsetMinutes=${offsetMinutes}`,
      { headers }
    ).pipe(
      timeout(environment.api.timeout),
      map(response => parseTelemetryResponse(response))
    );
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-api-key': environment.api.key,
      'Content-Type': 'application/json'
    });
  }
}