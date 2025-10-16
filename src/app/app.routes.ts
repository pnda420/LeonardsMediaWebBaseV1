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
import { AdminRequestsComponent } from './components/admin/admin-requests/admin-requests.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminGenPagesComponent } from './components/admin/admin-gen-pages/admin-gen-pages.component';
import { AdminSettingsComponent } from './components/admin/admin-settings/admin-settings.component';
import { GenerationLoadingComponent } from './shared/generation-loading/generation-loading.component';
import { BookingComponent } from './components/booking/booking.component';
import { AdminBookingComponent } from './components/admin/admin-booking/admin-booking.component';
import { ItServicesComponent } from './components/it-services/it-services.component';
import { AdminNewsletterComponent } from './components/admin/admin-newsletter/admin-newsletter.component';

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
    { path: 'booking', component: BookingComponent, title: pageMainName + ' | Buchung', data: { description: 'Buchungsseite von LeonardsMedia.' } },
    { path: 'services/one-pager', component: OnePagerComponent, title: pageMainName + ' | Einfache Website', data: { description: 'Einfache Webseite von LeonardsMedia.' } },
    { path: 'services/standard-website', component: StandardWebsiteComponent, title: pageMainName + ' | Standard Website', data: { description: 'Standard Website von LeonardsMedia.' } },
    { path: 'services/individual-website', component: IndividualWebsiteComponent, title: pageMainName + ' | Individuelle Website', data: { description: 'Individuelle Website von LeonardsMedia.' } },
    { path: 'services/seo-optimization', component: SeoOptimizationComponent, title: pageMainName + ' | SEO Optimierung', data: { description: 'SEO Optimierung von LeonardsMedia.' } },
    { path: 'survey', component: SurveyComponent, title: pageMainName + ' | Umfrage', data: { description: 'Umfrage von LeonardsMedia.' } },
    { path: 'preview', component: MainContainerComponent, title: pageMainName + ' | Vorschau', data: { description: 'Vorschau von LeonardsMedia.' } },
    { path: 'preview-form', component: InputFormComponent, title: pageMainName + ' | Vorschau Formular', data: { description: 'Vorschau Formular von LeonardsMedia.' } },
    { path: 'login', component: LoginComponent, title: pageMainName + ' | Login', data: { description: 'Login von LeonardsMedia.' } },
    { path: 'profile', component: ProfileComponent, title: pageMainName + ' | Profil', data: { description: 'Profil von LeonardsMedia.' } },
    { path: 'register', component: RegisterComponent, title: pageMainName + ' | Register', data: { description: 'Register von LeonardsMedia.' } },
    { path: 'generation-loading', component: GenerationLoadingComponent, title: pageMainName + ' | Wird erstellt', data: { description: 'Website wird generiert' } },
    { path: 'it-services', component: ItServicesComponent, title: pageMainName + ' | IT-Services', data: { description: 'IT-Services von LeonardsMedia.' } },

    { path: 'admin/requests', component: AdminRequestsComponent, canActivate: [authGuard, adminGuard], title: pageMainName + ' | Admin Requests', data: { description: 'Admin Requests von LeonardsMedia.' } },
    { path: 'admin/users', component: AdminUsersComponent, canActivate: [authGuard, adminGuard], title: pageMainName + ' | Admin Users', data: { description: 'Admin Users von LeonardsMedia.' } },
    { path: 'admin/gen-pages', component: AdminGenPagesComponent, canActivate: [authGuard, adminGuard], title: pageMainName + ' | Admin Gen Pages', data: { description: 'Admin Gen Pages von LeonardsMedia.' } },
    { path: 'admin/booking', component: AdminBookingComponent, canActivate: [authGuard, adminGuard], title: pageMainName + ' | Admin Booking', data: { description: 'Admin Booking von LeonardsMedia.' } },
    { path: 'admin/settings', component: AdminSettingsComponent, canActivate: [authGuard, adminGuard], title: pageMainName + ' | Admin Settings', data: { description: 'Admin Settings von LeonardsMedia.' } },
    { path: 'admin/newsletter', component: AdminNewsletterComponent, canActivate: [authGuard, adminGuard], title: pageMainName + ' | Admin Newsletter', data: { description: 'Admin Newsletter von LeonardsMedia.' } },
];