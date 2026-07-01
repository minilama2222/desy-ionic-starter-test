import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

/**
 * Thin wrapper around Ionic's `AlertController` so that pages can show
 * confirmations and messages without wiring `create + present` boilerplate
 * everywhere.
 *
 * In a real app you might wrap these calls in tests; the test fork does not
 * include them because they require a TestBed for the AlertController.
 */
@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly alertController = inject(AlertController);

  async confirm(options: { header: string; message: string; confirmText?: string; cancelText?: string }): Promise<boolean> {
    const alert = await this.alertController.create({
      header: options.header,
      message: options.message,
      buttons: [
        { text: options.cancelText ?? 'Cancelar', role: 'cancel' },
        { text: options.confirmText ?? 'Aceptar', role: 'confirm' }
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }

  async info(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}