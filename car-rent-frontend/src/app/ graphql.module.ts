import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { routes } from './app.routes';

// 🔧 Configurez l'URL de votre backend ici
const GRAPHQL_URI = 'http://localhost:3000/graphql';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideApollo(() => {
            const httpLink = new HttpLink();

            return {
                link: httpLink.create({
                    uri: 'http://localhost:3000/graphql', // 🔧 URL de votre backend
                }),
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