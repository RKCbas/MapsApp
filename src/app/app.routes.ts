import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'fullscreen',
    title: 'FullScreen Map',
    loadComponent: () => import('./pages/fullscreen-map-page/fullscreen-map-page.component')
  },
  {
    path: 'markers',
    title: 'Markers',
    loadComponent: () => import('./pages/fullscreen-map-page/fullscreen-map-page.component')
  },
  {
    path: 'houses',
    title: 'Available houses',
    loadComponent: () => import('./pages/houses-page/houses-page.component')
  },
  {
    path: '**',
    redirectTo: 'fullscreen'
  },


];
