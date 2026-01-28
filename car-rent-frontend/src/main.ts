import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { register as registerSwiperElements } from 'swiper/element/bundle';
import { ApolloModule } from 'apollo-angular';
import { HttpClientModule } from '@angular/common/http';

// Register Swiper custom elements
registerSwiperElements();

// Bootstrap the application with Apollo providers
bootstrapApplication(AppComponent, {
    providers: [
        ...appConfig.providers,
        // Import ApolloModule for standalone components
        importProvidersFrom(
            HttpClientModule,
            ApolloModule
        ),
    ]
}).catch((err) => console.error(err));