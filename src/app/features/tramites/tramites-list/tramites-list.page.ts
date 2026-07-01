import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner
} from '@ionic/angular/standalone';

import {
  DesyiCardComponent,
  DesyiIconComponent,
  DesyiPillComponent,
  DesyiSearchbarComponent,
  DesyiSegmentComponent,
  DesyiTextComponent
} from 'desy-ionic';

import { AppHeaderComponent } from '../../../shared/components/app-header/app-header.component';
import { AppEmptyStateComponent } from '../../../shared/components/app-empty-state/app-empty-state.component';
import { TramitesService, type Tramite, type TramiteEstado } from '../../../core/services/tramites.service';
import { LoggerService } from '../../../core/services/logger.service';

type Filter = 'all' | TramiteEstado;

/**
 * Real-world page: list of trámites with text search + status filter + loading
 * state + empty state. Used in the test fork to detect friction points in
 * the starter that don't show up in simpler demos.
 */
@Component({
  selector: 'app-tramites-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonNote,
    IonSpinner,
    DesyiCardComponent,
    DesyiIconComponent,
    DesyiPillComponent,
    DesyiSearchbarComponent,
    DesyiSegmentComponent,
    DesyiTextComponent,
    AppHeaderComponent,
    AppEmptyStateComponent
  ],
  templateUrl: './tramites-list.page.html',
  styleUrl: './tramites-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TramitesListPage {
  private readonly tramitesService = inject(TramitesService);
  private readonly logger = inject(LoggerService);

  readonly tramites = signal<Tramite[]>([]);
  readonly loading = signal(true);
  readonly query = signal('');
  readonly filter = signal<Filter>('all');

  readonly segmentButtons = [
    { value: 'all', text: 'Todos' },
    { value: 'pendiente', text: 'Pendientes' },
    { value: 'en-tramite', text: 'En trámite' },
    { value: 'requiere-subsanacion', text: 'Subsanación' },
    { value: 'finalizado', text: 'Finalizados' }
  ];

  readonly visibleItems = computed(() => {
    const needle = this.query().trim().toLowerCase();
    const status = this.filter();
    return this.tramites().filter((t) => {
      if (status !== 'all' && t.estado !== status) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return t.nombre.toLowerCase().includes(needle) || t.id.toLowerCase().includes(needle);
    });
  });

  readonly counts = computed(() => {
    const all = this.tramites();
    return {
      total: all.length,
      pendientes: all.filter((t) => t.estado === 'pendiente').length,
      enTramite: all.filter((t) => t.estado === 'en-tramite').length,
      subsanacion: all.filter((t) => t.estado === 'requiere-subsanacion').length
    };
  });

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      const list = await this.tramitesService.loadAll();
      this.tramites.set(list);
      this.logger.info(`tramites-list: loaded ${list.length} tramites`);
    } catch (err) {
      this.logger.error('tramites-list: failed to load', err);
    } finally {
      this.loading.set(false);
    }
  }

  onSearch(value: string | null | undefined): void {
    this.query.set(value ?? '');
  }

  onFilterChange(value: string): void {
    this.filter.set(value as Filter);
  }

  statusLabel(estado: TramiteEstado): string {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en-tramite':
        return 'En trámite';
      case 'requiere-subsanacion':
        return 'Requiere subsanación';
      case 'finalizado':
        return 'Finalizado';
      case 'rechazado':
        return 'Rechazado';
    }
  }

  statusColor(estado: TramiteEstado): 'primary' | 'success' | 'warning' | 'danger' | 'medium' {
    switch (estado) {
      case 'pendiente':
        return 'primary';
      case 'en-tramite':
        return 'warning';
      case 'requiere-subsanacion':
        return 'danger';
      case 'finalizado':
        return 'success';
      case 'rechazado':
        return 'medium';
    }
  }

  pillClass(estado: TramiteEstado): string {
    return `c-pill--${this.statusColor(estado)}`;
  }
}