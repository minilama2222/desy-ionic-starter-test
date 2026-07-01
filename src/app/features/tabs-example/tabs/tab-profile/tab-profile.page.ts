import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonNote } from '@ionic/angular/standalone';

import { DesyiButtonComponent, DesyiIconComponent, DesyiTextComponent } from 'desy-ionic';

@Component({
  selector: 'app-tab-profile-page',
  standalone: true,
  imports: [CommonModule, IonContent, IonNote, DesyiButtonComponent, DesyiIconComponent, DesyiTextComponent],
  templateUrl: './tab-profile.page.html',
  styleUrl: './tab-profile.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabProfilePage {
  readonly user = {
    name: 'Usuario de prueba',
    email: 'usuario@example.com',
    role: 'Ciudadano'
  };

  readonly icon = 'person-circle-outline';

  signOut(): void {
    // No real auth flow in the starter; this is just a placeholder action.
    // eslint-disable-next-line no-console
    console.info('[desy-ionic-starter] sign-out tapped');
  }
}