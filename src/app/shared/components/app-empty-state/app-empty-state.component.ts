import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

/**
 * Generic empty-state placeholder.
 *
 * Use it on lists, search results, dashboards etc. when there is nothing to
 * show. The icon defaults to an Ionic "sad" outline but can be overridden.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './app-empty-state.component.html',
  styleUrl: './app-empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppEmptyStateComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input() icon = 'sad-outline';
}