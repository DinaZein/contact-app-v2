import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
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
  provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
};
