import { Routes } from '@angular/router';

import { HomeComponent } from "./pages/home/home.component";


export const routes: Routes = [
  // ✅ HOME - Page standalone SANS layout (première route)
  {
    path: '',
    component: HomeComponent,
    title: 'RentIX - Rent The Car'
  },
  // Feature Auth (lazy loaded)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
        .then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes')
        .then(m => m.dashboardRoutes)
  },





  // ✅ 404 - En dernier

];