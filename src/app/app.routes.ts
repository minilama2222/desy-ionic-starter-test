import { Routes } from '@angular/router';

/**
 * Top-level routes for the DESY Ionic Starter.
 *
 * Every feature is lazy-loaded with `loadComponent` to keep the initial bundle small.
 * Add new pages here following the same pattern: a `path` and a `loadComponent`.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    title: 'Inicio · DESY Ionic',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage)
  },
  {
    path: 'tabs-example',
    loadComponent: () =>
      import('./features/tabs-example/tabs-example.page').then((m) => m.TabsExamplePage),
    loadChildren: () =>
      import('./features/tabs-example/tabs.routes').then((m) => m.TABS_ROUTES)
  },
  {
    path: 'forms-example',
    title: 'Formularios · DESY Ionic',
    loadComponent: () =>
      import('./features/forms-example/forms-example.page').then((m) => m.FormsExamplePage)
  },
  {
    path: 'list-example',
    title: 'Listas · DESY Ionic',
    loadComponent: () =>
      import('./features/list-example/list-example.page').then((m) => m.ListExamplePage)
  },
  {
    // Test fork: real-world páginas de "trámites"
    path: 'tramites',
    title: 'Mis trámites · DESY Ionic Test',
    loadComponent: () =>
      import('./features/tramites/tramites-list/tramites-list.page').then((m) => m.TramitesListPage)
  },
  {
    path: 'tramites/nueva',
    title: 'Nueva solicitud · DESY Ionic Test',
    loadComponent: () =>
      import('./features/tramites/solicitud-form/solicitud-form.page').then((m) => m.SolicitudFormPage)
  },
  {
    path: 'tramites/:id',
    title: 'Detalle del trámite · DESY Ionic Test',
    loadComponent: () =>
      import('./features/tramites/tramite-detail/tramite-detail.page').then((m) => m.TramiteDetailPage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];