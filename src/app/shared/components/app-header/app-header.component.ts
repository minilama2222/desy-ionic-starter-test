import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/angular/standalone';

/**
 * Reusable page header built on top of Ionic's `ion-header` / `ion-toolbar`.
 *
 * Provides a consistent header across the app without forcing every page to
 * import the Ionic primitives directly.
 *
 * Usage:
 * ```html
 * <app-header title="Mi página" [showBackButton]="true"></app-header>
 * ```
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent {
  /** Visible title of the page. */
  @Input({ required: true }) title!: string;

  /** Show a back button on the left side of the toolbar. */
  @Input() showBackButton = false;

  /** Default HREF for the back button when no history is available. */
  @Input() defaultHref = '/home';
}