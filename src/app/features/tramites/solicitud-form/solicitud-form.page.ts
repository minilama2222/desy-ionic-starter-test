import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonNote
} from '@ionic/angular/standalone';

import {
  DesyiButtonComponent,
  DesyiCardComponent,
  DesyiCheckboxComponent,
  DesyiInputComponent,
  DesyiStepListComponent,
  DesyiTextComponent,
  DesyiTextareaComponent
} from 'desy-ionic';

interface StepListItem {
  id: string;
  title: string;
  subtitle: string;
  state: 'pending' | 'currentmuted' | 'muted' | 'current' | 'past';
}

import { AppHeaderComponent } from '../../../shared/components/app-header/app-header.component';
import { AlertService } from '../../../core/services/alert.service';
import { LoggerService } from '../../../core/services/logger.service';

/**
 * Three-step solicitud form for a generic "Solicitud general" trámite.
 *
 * Used as the third test page in the fork to validate how the starter
 * handles multi-step flows, validation across steps, and confirmation.
 */
@Component({
  selector: 'app-solicitud-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonNote,
    DesyiButtonComponent,
    DesyiCheckboxComponent,
    DesyiInputComponent,
    DesyiStepListComponent,
    DesyiTextComponent,
    DesyiTextareaComponent,
    DesyiCardComponent,
    AppHeaderComponent
  ],
  templateUrl: './solicitud-form.page.html',
  styleUrl: './solicitud-form.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolicitudFormPage {
  private readonly fb = inject(FormBuilder);
  private readonly alertService = inject(AlertService);
  private readonly logger = inject(LoggerService);
  private readonly router = inject(Router);

  readonly step = signal(1);
  readonly submitted = signal(false);

  readonly steps: StepListItem[] = [
    { id: '1', title: 'Datos personales', subtitle: 'Paso 1 de 3', state: 'current' },
    { id: '2', title: 'Documentación', subtitle: 'Paso 2 de 3', state: 'pending' },
    { id: '3', title: 'Confirmación', subtitle: 'Paso 3 de 3', state: 'pending' }
  ];

  readonly stepStates: Record<number, StepListItem['state']> = {
    1: 'current',
    2: 'pending',
    3: 'pending'
  };

  readonly personalForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern(/^[0-9XYZxyz]\d{6,7}[A-Za-z]$/)]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^\+?[0-9 ]{6,}$/)]],
    direccion: ['', [Validators.required, Validators.minLength(5)]]
  });

  readonly docForm: FormGroup = this.fb.group({
    observaciones: ['', [Validators.maxLength(500)]]
  });

  readonly confirmForm: FormGroup = this.fb.group({
    acepta: [false, [Validators.requiredTrue]],
    declaraciones: [false, [Validators.requiredTrue]]
  });

  goNext(): void {
    if (this.step() === 1 && this.personalForm.invalid) {
      this.personalForm.markAllAsTouched();
      this.alertService.info('Datos incompletos', 'Revisa los campos marcados antes de continuar.');
      return;
    }
    if (this.step() === 2 && this.docForm.invalid) {
      this.docForm.markAllAsTouched();
      return;
    }
    if (this.step() === 3 && this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      this.alertService.info('Aceptación requerida', 'Debes aceptar las dos declaraciones para enviar la solicitud.');
      return;
    }
    this.step.update((s) => {
      const next = Math.min(3, s + 1);
      this.refreshSteps(next);
      return next;
    });
  }

  goBack(): void {
    this.step.update((s) => {
      const next = Math.max(1, s - 1);
      this.refreshSteps(next);
      return next;
    });
  }

  private refreshSteps(current: number): void {
    this.steps[0].state = current > 1 ? 'past' : current === 1 ? 'current' : 'pending';
    this.steps[1].state = current > 2 ? 'past' : current === 2 ? 'current' : 'pending';
    this.steps[2].state = current === 3 ? 'current' : 'pending';
  }

  async submit(): Promise<void> {
    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      return;
    }
    const confirmed = await this.alertService.confirm({
      header: 'Enviar solicitud',
      message: 'Se enviará tu solicitud al organismo responsable. ¿Continuar?',
      confirmText: 'Sí, enviar',
      cancelText: 'Cancelar'
    });
    if (!confirmed) return;

    const payload = {
      personal: this.personalForm.getRawValue(),
      documentacion: this.docForm.getRawValue(),
      confirmacion: this.confirmForm.getRawValue()
    };
    this.logger.info('solicitud-form: submitted', payload);
    this.submitted.set(true);
    await this.alertService.info(
      'Solicitud enviada',
      'Hemos registrado tu solicitud. Recibirás un justificante por correo electrónico.'
    );
    void this.router.navigate(['/tramites']);
  }
}