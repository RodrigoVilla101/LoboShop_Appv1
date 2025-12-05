import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rodrigovillalpando.loboshop',
  appName: 'LoboShop',
  webDir: 'dist',
  /* 
  server: {
    androidScheme: 'http',
    url: 'http://192.168.1.3:8100',
    cleartext: true,
  }, 
  */
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3880ff',
      showSpinner: false,
    },
  },
};

export default config;
