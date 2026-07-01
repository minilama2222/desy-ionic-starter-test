import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonItem, IonLabel } from '@ionic/angular/standalone';

import { DesyiCheckboxComponent, DesyiTextComponent } from 'desy-ionic';
import { AppEmptyStateComponent } from '../../../../shared/components/app-empty-state/app-empty-state.component';

interface Favorite {
  id: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-tab-favorites-page',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonItem,
    IonLabel,
    DesyiCheckboxComponent,
    DesyiTextComponent,
    AppEmptyStateComponent
  ],
  templateUrl: './tab-favorites.page.html',
  styleUrl: './tab-favorites.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabFavoritesPage {
  readonly checkedIcon = 'checkmark-circle-outline';
  readonly items = signal<Favorite[]>([
    { id: 'f1', title: 'Mis citas', description: 'Consulta y gestiona tus citas previas.' },
    { id: 'f2', title: 'Mis notificaciones', description: 'Buzón de notificaciones electrónicas.' },
    { id: 'f3', title: 'Mis expedientes', description: 'Estado y trazabilidad de tus trámites.' }
  ]);

  readonly checked = signal<Record<string, boolean>>({ f2: true });

  toggle(id: string, event: Event): void {
    const detail = (event as CustomEvent<{ checked: boolean }>).detail;
    const checked = !!detail?.checked;
    this.checked.update((state) => ({ ...state, [id]: checked }));
  }

  isChecked(id: string): boolean {
    return !!this.checked()[id];
  }
}