import { Injectable, signal } from '@angular/core';

/**
 * Tramite lifecycle states. Real apps would back this with a backend; in the
 * test fork we use a static list with a simulated network delay so that
 * pages can be validated against realistic UX patterns.
 */
export type TramiteEstado =
  | 'pendiente'
  | 'en-tramite'
  | 'requiere-subsanacion'
  | 'finalizado'
  | 'rechazado';

export interface Tramite {
  id: string;
  nombre: string;
  descripcion: string;
  estado: TramiteEstado;
  organismo: string;
  fechaSolicitud: string;
  ultimoMovimiento: string;
  documentos: number;
}

/**
 * In-memory data layer for the test fork. Exposes signals so any consumer can
 * reactively read the current list without manual subscriptions.
 */
@Injectable({ providedIn: 'root' })
export class TramitesService {
  private readonly _tramites = signal<Tramite[]>([
    {
      id: 'EX-2026-0001',
      nombre: 'Solicitud de empadronamiento',
      descripcion: 'Alta en el padrón municipal de Zaragoza',
      estado: 'pendiente',
      organismo: 'Ayuntamiento de Zaragoza',
      fechaSolicitud: '2026-06-12',
      ultimoMovimiento: '2026-06-12',
      documentos: 2
    },
    {
      id: 'EX-2026-0042',
      nombre: 'Ayudas escolares 2026',
      descripcion: 'Solicitud de ayuda para material escolar',
      estado: 'requiere-subsanacion',
      organismo: 'Departamento de Educación',
      fechaSolicitud: '2026-05-30',
      ultimoMovimiento: '2026-06-25',
      documentos: 4
    },
    {
      id: 'EX-2026-0078',
      nombre: 'Cita previa en oficina',
      descripcion: 'Renovación de cita en oficina de atención',
      estado: 'finalizado',
      organismo: 'Delegación del Gobierno',
      fechaSolicitud: '2026-04-15',
      ultimoMovimiento: '2026-05-02',
      documentos: 0
    },
    {
      id: 'EX-2026-0110',
      nombre: 'Consulta expediente urbanístico',
      descripcion: 'Solicitud de información sobre licencia de obra',
      estado: 'en-tramite',
      organismo: 'Dirección General de Urbanismo',
      fechaSolicitud: '2026-06-01',
      ultimoMovimiento: '2026-06-28',
      documentos: 3
    },
    {
      id: 'EX-2026-0125',
      nombre: 'Solicitud de certificado de residencia',
      descripcion: 'Emisión de certificado de empadronamiento',
      estado: 'pendiente',
      organismo: 'Ayuntamiento de Huesca',
      fechaSolicitud: '2026-06-20',
      ultimoMovimiento: '2026-06-20',
      documentos: 1
    },
    {
      id: 'EX-2026-0150',
      nombre: 'Notificación electrónica',
      descripcion: 'Notificación pendiente de lectura',
      estado: 'en-tramite',
      organismo: 'Sede electrónica',
      fechaSolicitud: '2026-06-26',
      ultimoMovimiento: '2026-06-29',
      documentos: 1
    },
    {
      id: 'EX-2026-0180',
      nombre: 'Solicitud de ayudas alquiler',
      descripcion: 'Programa de ayudas al alquiler 2026',
      estado: 'rechazado',
      organismo: 'Departamento de Vivienda',
      fechaSolicitud: '2026-03-10',
      ultimoMovimiento: '2026-04-22',
      documentos: 6
    },
    {
      id: 'EX-2026-0201',
      nombre: 'Renovación de demanda de empleo',
      descripcion: 'Renovación de la tarjeta de demanda',
      estado: 'finalizado',
      organismo: 'INAEM',
      fechaSolicitud: '2026-02-18',
      ultimoMovimiento: '2026-03-15',
      documentos: 0
    }
  ]);

  readonly tramites = this._tramites.asReadonly();

  /** Simulates a network round-trip. Real apps would hit an HTTP endpoint. */
  async loadAll(delayMs = 250): Promise<Tramite[]> {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return this._tramites();
  }

  async loadById(id: string, delayMs = 200): Promise<Tramite | undefined> {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return this._tramites().find((t) => t.id === id);
  }

  /** Used by the detail page to mark a trámite as finalized after "subsanación". */
  resolve(id: string): void {
    this._tramites.update((list) =>
      list.map((t) => (t.id === id ? { ...t, estado: 'en-tramite', ultimoMovimiento: new Date().toISOString().slice(0, 10) } : t))
    );
  }
}