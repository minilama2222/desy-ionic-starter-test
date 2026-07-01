import { Routes } from '@angular/router';

/**
 * Child routes for the tabs-example container page.
 *
 * Each child is a standalone page mounted by Ionic's tab mechanism. The default
 * redirect makes `/tabs-example` land on the first tab.
 */
export const TABS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./tabs/tab-home/tab-home.page').then((m) => m.TabHomePage)
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./tabs/tab-search/tab-search.page').then((m) => m.TabSearchPage)
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./tabs/tab-favorites/tab-favorites.page').then((m) => m.TabFavoritesPage)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./tabs/tab-profile/tab-profile.page').then((m) => m.TabProfilePage)
  }
];