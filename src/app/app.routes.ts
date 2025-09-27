import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { PolicyComponent } from './components/policy/policy.component';
import { ServicesComponent } from './components/services/services.component';

const pageMainName = 'Leonards Media';
export const routes: Routes = [
    { path: '', component: HomeComponent, title: pageMainName, data: { animation: 'home' } },
    { path: 'services', component: ServicesComponent, title: pageMainName + ' | Dienstleistungen', data: { animation: 'services' } },
    { path: 'about', component: AboutComponent, title: pageMainName + ' | Über uns', data: { animation: 'about' } },
    { path: 'contact', component: ContactComponent, title: pageMainName + ' | Kontakt', data: { animation: 'contact' } },
    { path: 'imprint', component: ImprintComponent, title: pageMainName + ' | Impressum', data: { animation: 'imprint' } },
    { path: 'policy', component: PolicyComponent, title: pageMainName + ' | Datenschutz', data: { animation: 'policy' } }
];
