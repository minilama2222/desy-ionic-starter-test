import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonNote,
  IonSpinner
} from '@ionic/angular/standalone';

import {
  DesyiButtonComponent,
  DesyiCardComponent,
  DesyiIconComponent,
  DesyiPillComponent,
  DesyiTextComponent
} from 'desy-ionic';

import { AppHeaderComponent } from '../../../shared/components/app-header/app-header.component';
import { AlertService } from '../../../core/services/alert.service';
import { TramitesService, type Tramite, type TramiteEstado } from '../../../core/services/tramites.service';
import { LoggerService } from '../../../core/services/logger.service';

/**
 * Detail page for a single trámite. Reads the `:id` route param, loads the
 * record via the service, and offers contextual actions depending on the
 * estado.
 */
@Component({
  selector: 'app-tramite-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,

    IonSpinner,
    DesyiButtonComponent,
    DesyiCardComponent,
    DesyiIconComponent,
    DesyiPillComponent,
    DesyiTextComponent,
    AppHeaderComponent
  ],
  templateUrl: './tramite-detail.page.html',
  styleUrl: './tramite-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TramiteDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly tramitesService = inject(TramitesService);
  private readonly alertService = inject(AlertService);
  private readonly logger = inject(LoggerService);

  readonly tramite = signal<Tramite | undefined>(undefined);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!id) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }
    void this.load(id);
  }

  private async load(id: string): Promise<void> {
    this.loading.set(true);
    const t = await this.tramitesService.loadById(id);
    if (!t) {
      this.notFound.set(true);
    } else {
      this.tramite.set(t);
    }
    this.loading.set(false);
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

  async subsanar(): Promise<void> {
    const t = this.tramite();
    if (!t) return;
    const confirmed = await this.alertService.confirm({
      header: 'Subsanar trámite',
      message: `Vas a aportar documentación para ${t.id}. ¿Continuar?`,
      confirmText: 'Sí, subsanar',
      cancelText: 'Cancelar'
    });
    if (!confirmed) return;
    this.tramitesService.resolve(t.id);
    const updated = await this.tramitesService.loadById(t.id, 50);
    this.tramite.set(updated);
    this.logger.info(`tramite-detail: subsanacion registered for ${t.id}`);
    await this.alertService.info('Subsanación registrada', 'Hemos enviado tu aportación al organismo responsable.');
  }
}