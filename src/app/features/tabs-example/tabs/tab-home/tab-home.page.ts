import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

import { DesyiIconComponent, DesyiTextComponent } from 'desy-ionic';

/**
 * First tab of the tabs-example. Acts as a welcome page inside the tabs container.
 */
@Component({
  selector: 'app-tab-home-page',
  standalone: true,
  imports: [CommonModule, IonContent, DesyiIconComponent, DesyiTextComponent],
  templateUrl: './tab-home.page.html',
  styleUrl: './tab-home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabHomePage {
  readonly icon = 'home-outline';
}