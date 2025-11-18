import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';

import { provideApollo } from 'apollo-angular';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(FormsModule),

    provideApollo(() => {
      return new ApolloClient({
        link: new HttpLink({
          uri: 'http://localhost:8080/graphql',  // AJUSTAR SI TU BACK NO ESTÁ AQUÍ
        }),
        cache: new InMemoryCache(),
      });
    }),
  ],
};
