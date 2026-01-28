import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // Configuration Apollo GraphQL
    {
      provide: APOLLO_OPTIONS,
      useFactory: () => {
        const httpLink = inject(HttpLink);

        // Error handling link
        const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
              console.error(
                  `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
              );
              console.error('Operation:', operation.operationName);
              console.error('Variables:', operation.variables);
            });
          }
          if (networkError) {
            console.error(`[Network error]: ${networkError}`);
            console.error('Network error details:', networkError);
          }
        });

        const link = ApolloLink.from([
          errorLink,
          httpLink.create({
            uri: 'http://localhost:3000/graphql',
          }),
        ]);

        return {
          link,
          cache: new InMemoryCache({
            addTypename: false,
          }),
          defaultOptions: {
            watchQuery: {
              errorPolicy: 'all',
              fetchPolicy: 'network-only',
            },
            query: {
              errorPolicy: 'all',
              fetchPolicy: 'network-only',
            },
            mutate: {
              errorPolicy: 'all',
            },
          },
        };
      },
    },
  ]
};