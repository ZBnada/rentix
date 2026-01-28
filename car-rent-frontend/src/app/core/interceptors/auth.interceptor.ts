// src/app/core/interceptors/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Essayer différents noms de clés possibles pour le token
  const token =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('accessToken') ||
      sessionStorage.getItem('access_token');

  // Log pour debug
  console.log('Auth Interceptor - URL:', req.url);
  console.log('Auth Interceptor - Token exists:', !!token);

  // Ajouter le token à toutes les requêtes vers le backend
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Auth Interceptor - Headers:', clonedRequest.headers.get('Authorization'));
    return next(clonedRequest);
  }

  console.warn('Auth Interceptor - No token found!');
  return next(req);
};