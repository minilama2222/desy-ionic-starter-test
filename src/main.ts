import { bootstrapApplication } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  searchOutline,
  heartOutline,
  personOutline,
  arrowForwardOutline,
  arrowBackOutline,
  businessOutline,
  calendarOutline,
  documentOutline,
  documentTextOutline,
  sadOutline,
  happyOutline,
  archiveOutline,
  cloudUploadOutline,
  helpCircleOutline,
  paperPlaneOutline,
  refreshOutline,
  checkmarkOutline,
  alertCircleOutline,
  logOutOutline,
  chevronForwardOutline,
  cubeOutline,
  albumsOutline,
  listOutline,
  closeOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Register all Ionicons used across the app so that <ion-icon name="…"> works
// in standalone components without per-page `addIcons` calls.
// In a real production app you would lazy-load this or filter down to the icons
// you actually use.
addIcons({
  'home-outline': homeOutline,
  'search-outline': searchOutline,
  'heart-outline': heartOutline,
  'person-outline': personOutline,
  'arrow-forward-outline': arrowForwardOutline,
  'arrow-back-outline': arrowBackOutline,
  'business-outline': businessOutline,
  'calendar-outline': calendarOutline,
  'document-outline': documentOutline,
  'document-text-outline': documentTextOutline,
  'sad-outline': sadOutline,
  'happy-outline': happyOutline,
  'archive-outline': archiveOutline,
  'cloud-upload-outline': cloudUploadOutline,
  'help-circle-outline': helpCircleOutline,
  'paper-plane-outline': paperPlaneOutline,
  'refresh-outline': refreshOutline,
  'checkmark-outline': checkmarkOutline,
  'alert-circle-outline': alertCircleOutline,
  'log-out-outline': logOutOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'cube-outline': cubeOutline,
  'albums-outline': albumsOutline,
  'list-outline': listOutline,
  'close-outline': closeOutline,
  'checkmark-circle-outline': checkmarkCircleOutline
});

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));