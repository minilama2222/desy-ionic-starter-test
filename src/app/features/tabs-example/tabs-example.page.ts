import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/angular/standalone';

/**
 * Container page that hosts four tabbed child pages.
 *
 * The tabs use `ion-tabs` (not `router-outlet`) so that each tab keeps its own
 * navigation stack. The URL remains `/tabs-example/<tab>` for deep linking.
 *
 * IMPORTANT: `<ion-tabs>` is the root of this page — do NOT wrap it in
 * `<ion-content>` or `<app-header>` because the tab bar gets hidden when the
 * component tree is rendered inside another layout container. See the
 * DIAGNOSTIC.md file for the full investigation.
 */
@Component({
  selector: 'app-tabs-example-page',
  standalone: true,
  imports: [
    RouterLink,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs
  ],
  templateUrl: './tabs-example.page.html',
  styleUrl: './tabs-example.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsExamplePage {
  readonly tabs = [
    { label: 'Inicio', icon: 'home-outline', tab: 'home', path: '/tabs-example/home' },
    { label: 'Buscar', icon: 'search-outline', tab: 'search', path: '/tabs-example/search' },
    { label: 'Favoritos', icon: 'heart-outline', tab: 'favorites', path: '/tabs-example/favorites' },
    { label: 'Perfil', icon: 'person-outline', tab: 'profile', path: '/tabs-example/profile' }
  ] as const;
}