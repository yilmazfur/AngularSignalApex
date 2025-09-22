import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Modern HTTP client provider
    importProvidersFrom(NgApexchartsModule) // Third-party module import
  ]
}).catch(err => console.error('Bootstrap failed:', err));
