import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCol,
  IonGrid,
  IonNote,
  IonRow
} from '@ionic/angular/standalone';

import {
  DesyiButtonComponent,
  DesyiCardComponent,
  DesyiIconComponent,

  DesyiTextComponent
} from 'desy-ionic';

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppFooterComponent } from '../../shared/components/app-footer/app-footer.component';

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  routerLink: string;
  cta: string;
  iconColor: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';
}

/**
 * Landing page of the DESY Ionic Starter.
 *
 * Shows four cards that link to the example features included in the starter:
 * tabs-example, forms-example, list-example and home (a meta link).
 */
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCol,
    IonGrid,
    IonNote,
    IonRow,
    DesyiButtonComponent,
    DesyiCardComponent,
    DesyiIconComponent,
    DesyiTextComponent,
    AppHeaderComponent,
    AppFooterComponent
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  readonly features: ReadonlyArray<FeatureCard> = [
    {
      title: 'Pestañas (Tabs)',
      description: 'Ejemplo de navegación inferior con 4 pestañas y páginas independientes.',
      icon: 'albums-outline',
      routerLink: '/tabs-example',
      cta: 'Ver ejemplo',
      iconColor: 'primary'
    },
    {
      title: 'Formularios',
      description: 'Formulario reactivo con campos del design system DESY.',
      icon: 'document-text-outline',
      routerLink: '/forms-example',
      cta: 'Ver ejemplo',
      iconColor: 'secondary'
    },
    {
      title: 'Listas',
      description: 'Lista filtrable con `desyi-segment` para alternar entre estados.',
      icon: 'list-outline',
      routerLink: '/list-example',
      cta: 'Ver ejemplo',
      iconColor: 'tertiary'
    },
    {
      title: 'Componentes `desyi-*`',
      description: 'Catálogo completo disponible en el Storybook de desy-ionic.',
      icon: 'cube-outline',
      routerLink: '/home',
      cta: 'Volver al inicio',
      iconColor: 'success'
    }
  ];
}