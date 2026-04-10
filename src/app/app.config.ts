import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@ngneat/transloco';
import { TranslocoHttpLoader } from './transloco-loader'; // make sure this exists
import { provideFunctions, getFunctions } from '@angular/fire/functions';
const firebaseConfig = {
  apiKey: "AIzaSyDTIjQj5y2qSXp2u706iGqCdGtxeZtZoZ4",
  authDomain: "contact-app-436fe.firebaseapp.com",
  projectId: "contact-app-436fe",
  storageBucket: "contact-app-436fe.firebasestorage.app",
  messagingSenderId: "618109216930",
  appId: "1:618109216930:web:2357a98f8b14e2923b4ffb",
  measurementId: "G-FBTQ3H56BD"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
  provideFunctions(() => getFunctions()),
    // Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),

    // HttpClient (only once)
    provideHttpClient(),

    // Transloco
provideTransloco({
  config: {
    availableLangs: ['en', 'de'],
    defaultLang: 'en',
    fallbackLang: 'en',
    reRenderOnLangChange: true,
    prodMode: !isDevMode()
  },
  loader: TranslocoHttpLoader
})
  ]
};