import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      })
    ),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
  .then(() => {
    if (!environment.production) {
      // Firestore emulátor
      connectFirestoreEmulator(getFirestore(), 'localhost', 8080);
      // Auth emulátor
      connectAuthEmulator(getAuth(), 'http://localhost:9099');
    }
  })
  .catch((err) => console.error(err));