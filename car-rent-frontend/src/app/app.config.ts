import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink, split } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    {
      provide: APOLLO_OPTIONS,
      useFactory: () => {
        const httpLink = inject(HttpLink);

        // ── 1. Error link (garde le tien intact) ──────────────────────
        const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
              console.error(`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`);
              console.error('Operation:', operation.operationName);
              console.error('Variables:', operation.variables);
            });
          }
          if (networkError) {
            console.error(`[Network error]: ${networkError}`);
          }
        });

        // ── 2. HTTP link — queries + mutations ────────────────────────
        const http = ApolloLink.from([
          errorLink,
          httpLink.create({ uri: 'http://localhost:3000/graphql' }),
        ]);

        // ── 3. WebSocket link — subscriptions uniquement ──────────────
        // graphql-ws = nouveau protocole, compatible avec NestJS 'graphql-ws'
        const ws = new GraphQLWsLink(
            createClient({
              url: 'ws://localhost:3000/graphql',
              retryAttempts: 5,
              on: {
                connected: () => console.log('[WS] Connecté au serveur GraphQL'),
                closed:    () => console.log('[WS] Connexion WebSocket fermée'),
                error:     (err) => console.error('[WS] Erreur WebSocket:', err),
              },
            }),
        );

        // ── 4. Split — subscription → WS, reste → HTTP ───────────────
        const link = split(
            ({ query }) => {
              const definition = getMainDefinition(query);
              return (
                  definition.kind === 'OperationDefinition' &&
                  definition.operation === 'subscription'
              );
            },
            ws,   // ← subscriptions
            http, // ← queries + mutations (avec errorLink)
        );

        return {
          link,
          cache: new InMemoryCache({ addTypename: false }),
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
  ],
};