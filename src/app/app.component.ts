import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

/**
 * Root component of the DESY Ionic Starter.
 *
 * Wires up the Ionic host (`<ion-app>`) and the router outlet so that
 * lazy-loaded pages can mount themselves inside the Ionic shell.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly appName = 'desy-ionic-starter';
}