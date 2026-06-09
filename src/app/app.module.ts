import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PrimeExportModule } from './shared/primeModuleExport.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatsComponent } from './components/stats/stats.component';
import { HeaderComponent } from './components/header/header.component';
import { ListPersonsComponent } from './components/list-persons/list-persons.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { DialogAddWeight } from './components/list-persons/dialog/dialogAddWeight';
import { DialogAddPerson } from './components/list-persons/dialog/dialogAddPerson';



registerLocaleData(localeFr, 'fr-FR');

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUogYsYTvRCZ9hC9tpZbGpRE4XiUOGDzc",
  authDomain: "sasweight.firebaseapp.com",
  projectId: "sasweight",
  storageBucket: "sasweight.firebasestorage.app",
  messagingSenderId: "284810036343",
  appId: "1:284810036343:web:9245d109d2850f36183272"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    StatsComponent,
    HeaderComponent,
    ListPersonsComponent,
    DialogAddWeight,
    DialogAddPerson
  ],
  imports: [
    //primeNG modules
    PrimeExportModule,
    //angular and other modules
    BrowserAnimationsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideHttpClient(),
    { provide: 'ENVIRONMENT', useValue: environment },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
