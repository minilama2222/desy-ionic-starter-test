import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'es.aragon.desy.ionic.starter',
  appName: 'desy-ionic-starter',
  webDir: 'www',
  android: {
    allowMixedContent: false
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;