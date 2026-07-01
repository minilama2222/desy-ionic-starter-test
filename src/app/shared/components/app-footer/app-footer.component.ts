import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonFooter, IonToolbar, IonTitle } from '@ionic/angular/standalone';

/**
 * Reusable page footer for pages that need a small attribution strip
 * (license, copyright, version stamp). Pages that prefer the bottom-tab
 * pattern should use `ion-tab-bar` instead.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, IonFooter, IonToolbar, IonTitle],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppFooterComponent {
  @Input() copyrightYear = new Date().getFullYear();
  @Input() license = 'EUPL-1.2';
}