import { Component } from '@angular/core';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
interface ServiceItem {
  title: string;
  slug: string;         // für routerLink
  img: string;
  short?: string;       // Make short optional by adding ?
  price?: string;       // "ab 1.800 €" etc.
  cta?: string;         // Button-Text
}


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [PageTitleComponent, RouterLink, CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  services: ServiceItem[] = [
    {
      title: 'Website One-Pager',
      slug: 'one-pager',
      img: 'assets/services.jpg',
      short: 'Einfache Website mit modernem Design und moderner Technologie.',
      price: 'ab 1.800 €',
      cta: 'Details & Beispiele'
    },
    {
      title: 'All-in-One-Lösung',
      slug: 'all-in-one',
      img: 'assets/services.jpg',
      short: 'Hosting, Domain, eine Seite Website - Alles in einem Paket.',
      price: 'ab 2.500 €',
      cta: 'Details & Beispiele'
    },
    {
      title: 'Firmenwebsite (3–8 Seiten)',
      slug: 'firmenwebsite',
      img: 'assets/services.jpg',
      short: 'Strukturierte Inhalte, SEO-Basics, sauberer Code & DSGVO.',
      price: 'ab 3.200 €',
      cta: 'Details & Preise'
    },
    {
      title: 'Relaunch & Performance',
      slug: 'relaunch-performance',
      img: 'assets/services.jpg',
      short: 'Ladezeit, Core Web Vitals, Bild-/Asset-Optimierung, SEO-Fix.',
      price: 'Pakete ab 1.200 €',
      cta: 'Leistungspakete ansehen'
    },
    {
      title: 'Web-App / Portal (Angular & NestJS)',
      slug: 'webapp-portal',
      img: 'assets/services.jpg',
      short: 'MVPs, Dashboards, interne Tools – sauber getrackt & getestet.',
      price: 'individuell',
      cta: 'Projekt anfragen'
    },
    {
      title: 'Wartung & Betreuung',
      slug: 'wartung',
      img: 'assets/services.jpg',
      short: 'Updates, Backups, Monitoring, kleine Content-Änderungen.',
      price: 'ab 69 €/Monat',
      cta: 'Pakete vergleichen'
    },
    {
      title: 'DSGVO & Tracking',
      slug: 'dsgvo-tracking',
      img: 'assets/services.jpg',
      short: 'Plausible/Matomo, Cookie-frei möglich, saubere Events.',
      price: 'Setup ab 390 €',
      cta: 'So setze ich das um'
    }
  ];
}
