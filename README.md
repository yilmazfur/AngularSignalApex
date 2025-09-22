# ⚡ A Battery Dashboard - Angular 19.2

A modern, high-performance battery monitoring dashboard built with **Angular 19.2**, featuring **Signal-based state management** and **real-time telemetry visualization**.

## 🚀 Project Highlights

- **Angular 19.2** with latest features and standalone components
- **Signal-First Architecture** for reactive state management
- **Real-time monitoring** with auto-refresh capabilities
- **ApexCharts integration** for interactive telemetry visualization
- **Modern TypeScript** with strict type safety


## 🏗️ Architecture Overview

```
src/
├── app/
│   ├── components/
│   │   └── dashboard/           # Main dashboard component
│   ├── services/
│   │   ├── api.service.ts       # HTTP API communication
│   │   └── dashboard-state.service.ts  # Signal-based state management
│   ├── models/
│   │   ├── battery-status.model.ts
│   │   └── telemetry-response.model.ts
│   └── main.ts                  # Standalone bootstrap
├── environments/
```

## 🔧 Technology Stack

- **Framework**: Angular 19.2 (Standalone Components)
- **State Management**: Angular Signals
- **Charts**: ApexCharts + ng-apexcharts
- **Styling**: Modern CSS with CSS Grid & Flexbox
- **HTTP Client**: Angular HttpClient with RxJS
- **TypeScript**: 5.6+ with strict mode
- **Build Tool**: Angular CLI with Vite

## 🎯 Key Features

### 📈 **Real-Time Monitoring**
- Live battery power, status, and capacity tracking
- Configurable auto-refresh intervals (30s default)
- Visual status indicators with color-coded states

### 📊 **Interactive Analytics**
- Dynamic time-series charts with multiple metrics
- Selectable timeframes (1hr, 1 day, 1 week)
- Responsive chart rendering with zoom capabilities

### 🔄 **Signal-Based Reactivity**
```typescript
// Modern Signal implementation
readonly batteryStatus = signal<BatteryStatus | null>(null);
readonly isLoading = signal<boolean>(false);
readonly chartOptions = computed(() => this.buildChartConfig());

// Automatic effect for auto-refresh
constructor() {
  effect(() => {
    if (this.autoRefresh()) {
      this.startPolling();
    } else {
      this.stopPolling();
    }
  });
}
```


## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Angular CLI 19.2+

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Angular_Dashboard

# Install dependencies
npm install

# Start development server
ng serve

# Open browser
http://localhost:4200
```

### Docker Setup
```bash
# Build and run with Docker
# run Docker Desktop 

docker-compose up --build
```
# Open browser
http://localhost:4201


## 🔧 Configuration

### Environment Settings
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  api: {
    baseUrl: '/api',
    timeout: 10000,
    retryAttempts: 3
  },
  monitoring: {
    refreshInterval: 30000,
    maxDataPoints: 100
  }
};
```

### API Integration
```typescript
// Connects to battery management API
GET /api/v1/batteries/{deviceId}/status
GET /api/v1/batteries/{deviceId}/telemetry?OffsetMinutes={offset}
```

## 🧪 Testing

```bash
# Unit tests
ng test

# Test coverage
ng test --code-coverage
```

## 🔧 Development Commands

```bash
# Development server
ng serve

```

## 📈 Planned Improvements

### 🔥 **Critical Priority**
- **Security**: Move hardcoded API key to environment variables to prevent security breaches
- **Environment**: Create separate config files for dev/staging/production environments
- **Error Handling**: Add global error handling with user-friendly messages and retry logic

### 🚀 **High Priority** 
- **Testing**: Implement unit and integration tests for code reliability
- **Performance**: Add HTTP and memory caching to reduce API calls and improve performance
- **Real-time**: Replace 30-second polling with real-time WebSocket connections

### 📊 **Medium Priority**
- **Accessibility**: Add ARIA labels, keyboard navigation, and screen reader support
- **Logging**: Replace console.log with structured logging for production monitoring

<img width="1356" height="886" alt="image" src="https://github.com/user-attachments/assets/c5af6f04-ddab-4e7c-85e8-26959203f5a3" />
