import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Ionic-Angular',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    // url: "http://localhost:8100",
    // url: "http://192.168.0.104:8101",

    cleartext: true,    
  },
  
  

};

export default config;
