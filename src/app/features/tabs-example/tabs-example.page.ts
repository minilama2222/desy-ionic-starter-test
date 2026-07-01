import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/angular/standalone';

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

/**
 * Container page that hosts four tabbed child pages.
 *
 * The tabs use `ion-tabs` (not `router-outlet`) so that each tab keeps its own
 * navigation stack. The URL remains `/tabs-example/<tab>` for deep linking.
 */
@Component({
  selector: 'app-tabs-example-page',
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    AppHeaderComponent
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