import { Component } from '@angular/core';
import { PageTitleComponent } from "../../shared/page-title/page-title.component";
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-home',
  standalone: true,
  imports: [PageTitleComponent, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  services: ServiceItem[] = [
    {
      title: 'Website One-Pager',
      slug: 'one-pager',
      img: 'assets/leistungen/onepager.jpg',
      price: 'ab 1.800 €',
      cta: 'Details & Beispiele'
    },
    {
      title: 'Firmenwebsite (3–8 Seiten)',
      slug: 'firmenwebsite',
      img: 'assets/leistungen/firmenwebsite.jpg',
      short: 'Strukturierte Inhalte, SEO-Basics, sauberer Code & DSGVO.',
      price: 'ab 3.200 €',
      cta: 'Details & Preise'
    },
    {
      title: 'Relaunch & Performance',
      slug: 'relaunch-performance',
      img: 'assets/leistungen/performance.jpg',
      short: 'Ladezeit, Core Web Vitals, Bild-/Asset-Optimierung, SEO-Fix.',
      price: 'Pakete ab 1.200 €',
      cta: 'Leistungspakete ansehen'
    },
    {
      title: 'Web-App / Portal (Angular & NestJS)',
      slug: 'webapp-portal',
      img: 'assets/leistungen/webapp.jpg',
      short: 'MVPs, Dashboards, interne Tools – sauber getrackt & getestet.',
      price: 'individuell',
      cta: 'Projekt anfragen'
    },
    {
      title: 'Wartung & Betreuung',
      slug: 'wartung',
      img: 'assets/leistungen/wartung.jpg',
      short: 'Updates, Backups, Monitoring, kleine Content-Änderungen.',
      price: 'ab 69 €/Monat',
      cta: 'Pakete vergleichen'
    },
    {
      title: 'DSGVO & Tracking',
      slug: 'dsgvo-tracking',
      img: 'assets/leistungen/dsgvo.jpg',
      short: 'Plausible/Matomo, Cookie-frei möglich, saubere Events.',
      price: 'Setup ab 390 €',
      cta: 'So setze ich das um'
    }
  ];
}
