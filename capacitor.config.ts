import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.meetly.app',
  appName: 'Meetly',
  webDir: 'out',
  server: {
    url: 'https://meetlyin.vercel.app',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
