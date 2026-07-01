import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';

import {
  DesyiCheckboxComponent,
  DesyiRadioComponent,
  DesyiSegmentComponent,
  DesyiTextComponent
} from 'desy-ionic';

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppEmptyStateComponent } from '../../shared/components/app-empty-state/app-empty-state.component';

type Status = 'active' | 'inactive';

interface ListItem {
  id: string;
  name: string;
  detail: string;
  status: Status;
}

type Filter = 'all' | Status;

@Component({
  selector: 'app-list-example-page',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonItem,
    IonLabel,
    IonNote,
    DesyiCheckboxComponent,
    DesyiRadioComponent,
    DesyiSegmentComponent,
    DesyiTextComponent,
    AppHeaderComponent,
    AppEmptyStateComponent
  ],
  templateUrl: './list-example.page.html',
  styleUrl: './list-example.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListExamplePage {
  readonly items = signal<ListItem[]>([
    { id: '1', name: 'Trámite de empadronamiento', detail: 'En plazo', status: 'active' },
    { id: '2', name: 'Solicitud de ayudas escolares', detail: 'Pendiente de documentación', status: 'active' },
    { id: '3', name: 'Cita previa oficina Zaragoza', detail: 'Finalizada', status: 'inactive' },
    { id: '4', name: 'Consulta expediente EX-2026-0042', detail: 'En revisión', status: 'active' },
    { id: '5', name: 'Notificación electrónica 12/06', detail: 'Leída', status: 'inactive' },
    { id: '6', name: 'Solicitud certificado de residencia', detail: 'En plazo', status: 'active' }
  ]);

  readonly filter = signal<Filter>('all');
  readonly selected = signal<string | null>(null);

  readonly visibleItems = computed(() => {
    const current = this.filter();
    if (current === 'all') {
      return this.items();
    }
    return this.items().filter((i) => i.status === current);
  });

  readonly segmentButtons = [
    { value: 'all', text: 'Todos' },
    { value: 'active', text: 'Activos' },
    { value: 'inactive', text: 'Inactivos' }
  ];

  select(id: string): void {
    this.selected.set(id);
  }

  onFilterChange(value: string): void {
    if (value === 'all' || value === 'active' || value === 'inactive') {
      this.filter.set(value);
    }
  }

  toggleDone(id: string, event: Event): void {
    const detail = (event as CustomEvent<{ checked: boolean }>).detail;
    const checked = !!detail?.checked;
    this.items.update((list) =>
      list.map((item) =>
        item.id === id ? { ...item, status: checked ? 'active' : 'inactive' } : item
      )
    );
  }
}