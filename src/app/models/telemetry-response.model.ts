export interface TelemetrySeries {
  name: string;
  data: [number, number][];
}

export interface TelemetryApiResponse {
  series: TelemetrySeries[];
}

export function parseTelemetryResponse(response: TelemetryApiResponse) {
  return response.series.reduce((acc, curr) => {
    acc[curr.name] = curr.data.map(([timestamp, value]) => ({
      timestamp: new Date(timestamp),
      value,
    }));
    return acc;
  }, {} as Record<string, { timestamp: Date; value: number }[]>);
}