import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { PolicyComponent } from './components/policy/policy.component';
import { ServicesComponent } from './components/services/services.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';

const pageMainName = 'Leonards Media';
export const routes: Routes = [
    { path: '', component: HomeComponent, title: pageMainName },
    { path: 'services', component: ServicesComponent, title: pageMainName + ' | Dienstleistungen' },
    { path: 'about', component: AboutComponent, title: pageMainName + ' | Über uns' },
    { path: 'contact', component: ContactComponent, title: pageMainName + ' | Kontakt' },
    { path: 'imprint', component: ImprintComponent, title: pageMainName + ' | Impressum' },
    { path: 'policy', component: PolicyComponent, title: pageMainName + ' | Datenschutz' },
    { path: 'services/:slug', component: ServiceDetailComponent } 
];
