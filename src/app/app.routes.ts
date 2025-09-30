import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { PolicyComponent } from './components/policy/policy.component';
import { ServicesComponent } from './components/services/services.component';
import { ServerStatusComponent } from './components/server-status/server-status.component';
import { VorgehenComponent } from './components/vorgehen/vorgehen.component';
import { FaqComponent } from './components/faq/faq.component';
import { OnePagerComponent } from './components/services/one-pager/one-pager.component';
import { AllInOneComponent } from './components/services/all-in-one/all-in-one.component';
import { LargeWebsiteComponent } from './components/services/large-website/large-website.component';
import { SeoOptimizationComponent } from './components/services/seo-optimization/seo-optimization.component';
import { MainContainerComponent } from './components/preview/main-container/main-container.component';

const pageMainName = 'Leonards Media';
export const routes: Routes = [
    { path: '', component: HomeComponent, title: pageMainName, data: { description: 'IT-Dienstleistungen, Webentwicklung und SEO – pragmatisch, transparent und zuverlässig. Leonards Media hilft Ihnen bei Konzeption, Entwicklung und Betrieb.' } },
    { path: 'services', component: ServicesComponent, title: pageMainName + ' | Dienstleistungen', data: { description: 'Übersicht unserer Leistungen: Websites, All-in-One-Pakete, Full-Stack-Entwicklung und SEO-Optimierung. Klar strukturiert und wirkungsorientiert.' } },
    { path: 'about', component: AboutComponent, title: pageMainName + ' | Über uns', data: { description: 'Erfahren Sie mehr über Leonards Media: Werte, Arbeitsweise und warum wir Technologie pragmatisch und zielorientiert einsetzen.' } },
    { path: 'contact', component: ContactComponent, title: pageMainName + ' | Kontakt', data: { description: 'Kontaktieren Sie Leonards Media für ein unverbindliches Erstgespräch. Schnelle Einschätzung ohne Sales-Druck.' } },
    { path: 'imprint', component: ImprintComponent, title: pageMainName + ' | Impressum', data: { description: 'Impressum von Leonards Media.' } },
    { path: 'server-status', component: ServerStatusComponent, title: pageMainName + ' | Systemstatus', data: { description: 'Systemstatus von Leonards Media.' } },
    { path: 'process', component: VorgehenComponent, title: pageMainName + ' | Vorgehen', data: { description: 'Vorgehen von Leonards Media.' } },
    { path: 'faq', component: FaqComponent, title: pageMainName + ' | FAQ', data: { description: 'FAQ von Leonards Media.' } },
    { path: 'policy', component: PolicyComponent, title: pageMainName + ' | Datenschutz', data: { description: 'Datenschutzerklärung von Leonards Media.' } },
    { path: 'services/one-pager', component: OnePagerComponent, title: pageMainName + ' | Website One-Pager', data: { description: 'Website One-Pager von Leonards Media.' } },
    { path: 'services/all-in-one', component: AllInOneComponent, title: pageMainName + ' | All-in-One-Lösung', data: { description: 'All-in-One-Lösung von Leonards Media.' } },
    { path: 'services/large-website', component: LargeWebsiteComponent, title: pageMainName + ' | Große Website', data: { description: 'Große Website von Leonards Media.' } },
    { path: 'services/seo-optimization', component: SeoOptimizationComponent, title: pageMainName + ' | SEO Optimierung', data: { description: 'SEO Optimierung von Leonards Media.' } },
    { path: 'preview', component: MainContainerComponent, title: pageMainName + ' | Preview', data: { description: 'Preview von Leonards Media.' } },
];
