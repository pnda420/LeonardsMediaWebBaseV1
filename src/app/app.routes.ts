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
import { SeoOptimizationComponent } from './components/services/seo-optimization/seo-optimization.component';
import { MainContainerComponent } from './components/preview/main-container/main-container.component';
import { InputFormComponent } from './components/preview/input-form/input-form.component';
import { SurveyComponent } from './components/survey/survey.component';
import { StandardWebsiteComponent } from './components/services/standard-website/standard-website.component';
import { IndividualWebsiteComponent } from './components/services/individual-website/individual-website.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';

const pageMainName = 'LeonardsMedia';
export const routes: Routes = [
    { path: '', component: HomeComponent, title: pageMainName, data: { description: 'IT-Dienstleistungen, Webentwicklung und SEO – pragmatisch, transparent und zuverlässig. LeonardsMedia hilft Ihnen bei Konzeption, Entwicklung und Betrieb.' } },
    { path: 'services', component: ServicesComponent, title: pageMainName + ' | Dienstleistungen', data: { description: 'Übersicht unserer Leistungen: Websites, All-in-One-Pakete, Full-Stack-Entwicklung und SEO-Optimierung. Klar strukturiert und wirkungsorientiert.' } },
    { path: 'about', component: AboutComponent, title: pageMainName + ' | Über uns', data: { description: 'Erfahren Sie mehr über LeonardsMedia: Werte, Arbeitsweise und warum wir Technologie pragmatisch und zielorientiert einsetzen.' } },
    { path: 'contact', component: ContactComponent, title: pageMainName + ' | Kontakt', data: { description: 'Kontaktieren Sie LeonardsMedia für ein unverbindliches Erstgespräch. Schnelle Einschätzung ohne Sales-Druck.' } },
    { path: 'imprint', component: ImprintComponent, title: pageMainName + ' | Impressum', data: { description: 'Impressum von LeonardsMedia.' } },
    { path: 'server-status', component: ServerStatusComponent, title: pageMainName + ' | Systemstatus', data: { description: 'Systemstatus von LeonardsMedia.' } },
    { path: 'process', component: VorgehenComponent, title: pageMainName + ' | Vorgehen', data: { description: 'Vorgehen von LeonardsMedia.' } },
    { path: 'faq', component: FaqComponent, title: pageMainName + ' | FAQ', data: { description: 'FAQ von LeonardsMedia.' } },
    { path: 'policy', component: PolicyComponent, title: pageMainName + ' | Datenschutz', data: { description: 'Datenschutzerklärung von LeonardsMedia.' } },
    { path: 'services/one-pager', component: OnePagerComponent, title: pageMainName + ' | Einfache Website', data: { description: 'Einfache Webseite von LeonardsMedia.' } },
    { path: 'services/standard-website', component: StandardWebsiteComponent, title: pageMainName + ' | Standard Website', data: { description: 'Standard Website von LeonardsMedia.' } },
    { path: 'services/individual-website', component: IndividualWebsiteComponent, title: pageMainName + ' | Individuelle Website', data: { description: 'Individuelle Website von LeonardsMedia.' } },
    { path: 'services/seo-optimization', component: SeoOptimizationComponent, title: pageMainName + ' | SEO Optimierung', data: { description: 'SEO Optimierung von LeonardsMedia.' } },
    { path: 'survey', component: SurveyComponent, title: pageMainName + ' | Umfrage', data: { description: 'Umfrage von LeonardsMedia.' } },
    { path: 'preview', component: MainContainerComponent, title: pageMainName + ' | Preview', data: { description: 'Preview von LeonardsMedia.' } },
    { path: 'preview-form', component: InputFormComponent, title: pageMainName + ' | Preview2', data: { description: 'Preview2 von LeonardsMedia.' } },
];
