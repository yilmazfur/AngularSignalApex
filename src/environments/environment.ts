export const environment = { //used in api service
  production: false,
  api: {
    baseUrl: '/api',
    key: '',
    timeout: 10000,
    retryAttempts: 3
  },
  monitoring: {
    refreshInterval: 30000,
    maxDataPoints: 100,
    enableRealTimeUpdates: true
  },
  features: {
    enableDebugLogs: true,
    enablePerformanceMetrics: true,
    enableOfflineMode: false
  }
};
