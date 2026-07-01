import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';

import { DesyiSearchbarComponent } from 'desy-ionic';
import { AppEmptyStateComponent } from '../../../../shared/components/app-empty-state/app-empty-state.component';

interface Suggestion {
  id: string;
  name: string;
  category: string;
}

/**
 * Second tab of the tabs-example. Demonstrates `desyi-searchbar` plus basic
 * filtering logic using Angular signals.
 */
@Component({
  selector: 'app-tab-search-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    DesyiSearchbarComponent,
    AppEmptyStateComponent
  ],
  templateUrl: './tab-search.page.html',
  styleUrl: './tab-search.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabSearchPage {
  readonly all = signal<Suggestion[]>([
    { id: '1', name: 'Trámite de empadronamiento', category: 'Trámites' },
    { id: '2', name: 'Cita previa en oficina', category: 'Citas' },
    { id: '3', name: 'Consulta de expediente', category: 'Trámites' },
    { id: '4', name: 'Notificaciones electrónicas', category: 'Comunicaciones' },
    { id: '5', name: 'Ayudas y subvenciones', category: 'Ayudas' },
    { id: '6', name: 'Solicitud de certificado', category: 'Trámites' }
  ]);

  readonly query = signal('');
  readonly filtered = signal<Suggestion[]>(this.all());

  onSearch(value: string | null | undefined): void {
    const safe = value ?? '';
    this.query.set(safe);
    const needle = safe.trim().toLowerCase();
    if (!needle) {
      this.filtered.set(this.all());
      return;
    }
    this.filtered.set(this.all().filter((s) => s.name.toLowerCase().includes(needle)));
  }

  onSearchEvent(event: Event): void {
    const detail = (event as CustomEvent<{ value?: string }>).detail;
    this.onSearch(detail?.value);
  }
}