import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { PolicyComponent } from './components/policy/policy.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';


const pageMainName = 'LeonardsMedia';
export const routes: Routes = [
    { path: '', component: HomeComponent, title: pageMainName, data: { description: 'IT-Dienstleistungen, Webentwicklung und SEO – pragmatisch, transparent und zuverlässig. LeonardsMedia hilft Ihnen bei Konzeption, Entwicklung und Betrieb.' } },
    { path: 'about', component: AboutComponent, title: pageMainName + ' | Über uns', data: { description: 'Erfahren Sie mehr über LeonardsMedia: Werte, Arbeitsweise und warum wir Technologie pragmatisch und zielorientiert einsetzen.' } },
    { path: 'contact', component: ContactComponent, title: pageMainName + ' | Kontakt', data: { description: 'Kontaktieren Sie LeonardsMedia für ein unverbindliches Erstgespräch. Schnelle Einschätzung ohne Sales-Druck.' } },
    { path: 'imprint', component: ImprintComponent, title: pageMainName + ' | Impressum', data: { description: 'Impressum von LeonardsMedia.' } },
    { path: 'policy', component: PolicyComponent, title: pageMainName + ' | Datenschutz', data: { description: 'Datenschutzerklärung von LeonardsMedia.' } },
    { path: 'login', component: LoginComponent, title: pageMainName + ' | Login', data: { description: 'Login von LeonardsMedia.' } },
    { path: 'profile', component: ProfileComponent, title: pageMainName + ' | Profil', data: { description: 'Profil von LeonardsMedia.' } },
    { path: 'register', component: RegisterComponent, title: pageMainName + ' | Register', data: { description: 'Register von LeonardsMedia.' } },

];