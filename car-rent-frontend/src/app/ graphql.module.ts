import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import {InMemoryCache, split} from '@apollo/client/core';

import { routes } from './app.routes';
import {WebSocketLink} from "@apollo/client/link/ws";
import {getMainDefinition} from "@apollo/client/utilities";

// 🔧 Configurez l'URL de votre backend ici
const GRAPHQL_URI = 'http://localhost:3000/graphql';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideApollo(() => {
            // @ts-ignore
            const httpLink = new HttpLink();
            const http=  httpLink.create({
                uri: 'http://localhost:3000/graphql', // 🔧 URL de votre backend
            });

            const ws = new WebSocketLink({
                uri: 'ws://localhost:3000/graphql',
                options: {
                    reconnect: true,
                },
            });

            const link = split(
                ({ query }) => {
                    const definition = getMainDefinition(query);
                    return (
                        definition.kind === 'OperationDefinition' &&
                        definition.operation === 'subscription'
                    );
                },
                ws,   // subscription → websocket
                http  // query/mutation → http
            );

            return {
                link,
                cache: new InMemoryCache(),
                defaultOptions: {
                    watchQuery: {
                        fetchPolicy: 'network-only',
                        errorPolicy: 'all',
                    },
                    query: {
                        fetchPolicy: 'network-only',
                        errorPolicy: 'all',
                    },
                },
            };
        }),
    ],
};