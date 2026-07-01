import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonNote
} from '@ionic/angular/standalone';

import {
  DesyiButtonComponent,
  DesyiCheckboxGroupComponent,
  DesyiDatetimeComponent,
  DesyiInputComponent,
  DesyiRadioGroupComponent,
  DesyiSelectComponent,
  DesyiTextComponent
} from 'desy-ionic';

interface CheckboxItem {
  name: string;
  value: string;
  text: string;
}

interface CheckboxGroupData {
  group: string;
  items: CheckboxItem[];
}

interface RadioItem {
  value: string;
  text: string;
}

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { LoggerService } from '../../core/services/logger.service';

interface SelectItem {
  value: string;
  text: string;
}

/**
 * Reactive form showcase with the full set of `desyi-*` form controls.
 *
 * Demonstrates how to bind each component to a `FormGroup` and surface the
 * resulting value back to the UI for inspection.
 */
@Component({
  selector: 'app-forms-example-page',
  standalone: true,
  imports: [
    CommonModule,
    JsonPipe,
    ReactiveFormsModule,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonNote,
    DesyiButtonComponent,
    DesyiCheckboxGroupComponent,
    DesyiDatetimeComponent,
    DesyiInputComponent,
    DesyiRadioGroupComponent,
    DesyiSelectComponent,
    DesyiTextComponent,
    AppHeaderComponent
  ],
  templateUrl: './forms-example.page.html',
  styleUrl: './forms-example.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsExamplePage {
  private readonly fb = inject(FormBuilder);
  private readonly logger = inject(LoggerService);

  readonly provinceItems: SelectItem[] = [
    { value: 'huesca', text: 'Huesca' },
    { value: 'teruel', text: 'Teruel' },
    { value: 'zaragoza', text: 'Zaragoza' }
  ];

  readonly interestGroups: CheckboxGroupData[] = [
    {
      group: 'Intereses',
      items: [
        { name: 'tramites', value: 'tramites', text: 'Trámites administrativos' },
        { name: 'ayudas', value: 'ayudas', text: 'Ayudas y subvenciones' },
        { name: 'empleo', value: 'empleo', text: 'Empleo público' },
        { name: 'citas', value: 'citas', text: 'Citas previas' }
      ]
    }
  ];

  readonly genderItems: RadioItem[] = [
    { value: 'mujer', text: 'Mujer' },
    { value: 'hombre', text: 'Hombre' },
    { value: 'no-binario', text: 'No binario' },
    { value: 'prefiero-no-decirlo', text: 'Prefiero no decirlo' }
  ];

  readonly submittedValue = signal<unknown>(null);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    province: ['zaragoza', [Validators.required]],
    birthDate: [null as string | null, [Validators.required]],
    interests: this.fb.group({
      tramites: [false],
      ayudas: [false],
      empleo: [false],
      citas: [false]
    }),
    gender: ['prefiero-no-decirlo', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.logger.warn('forms-example: invalid form submission');
      return;
    }
    const value = this.form.getRawValue();
    this.submittedValue.set(value);
    this.logger.info('forms-example: submitted', value);
  }

  reset(): void {
    this.form.reset({
      name: '',
      email: '',
      province: 'zaragoza',
      birthDate: null,
      interests: { tramites: false, ayudas: false, empleo: false, citas: false },
      gender: 'prefiero-no-decirlo'
    });
    this.submittedValue.set(null);
  }
}