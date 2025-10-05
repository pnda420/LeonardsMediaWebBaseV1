import { Injectable } from '@angular/core';

export interface ServiceItem {
  title: string;
  slug: string;
  img: string;
  short?: string;
  features?: string[];
  badge?: string
  price?: string;
  cta?: string;
  route: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceDataService {

  private services: ServiceItem[] = [
    {
      title: 'Einfache Website',
      slug: 'one-pager',
      img: 'assets/cards/simple-min.png',
      short: 'Eine einzelne Seite mit allen wichtigen Infos. Perfekt für den schnellen Start.',
      features: [
        'Live in 1-3 Wochen',
        'Bis zu 5 Abschnitte',
        'Mobil optimiert',
        'Kontaktformular inklusive',
        'Basis-SEO & DSGVO'
      ],
      badge: '🚀 Beliebt',
      price: 'ab 1.800 €',
      cta: 'Jetzt ansehen',
      route: 'one-pager',
    },
    {
      title: 'Standard Website',
      slug: 'standard-website',
      img: 'assets/cards/standard-min.png',
      short: 'Mehrere Unterseiten für strukturierte Inhalte. Ideal für etablierte Angebote.',
      features: [
        '3-8 Unterseiten',
        'Navigation & Footer',
        'Blog-System (optional)',
        'Erweiterte SEO',
        'Kontakt & Formulare'
      ],
      badge: '⭐ Empfohlen',
      price: 'ab 3.500 €',
      cta: 'Jetzt ansehen',
      route: 'standard-website',
    },
    {
      title: 'Individual Website',
      slug: 'individual-website',
      img: 'assets/cards/individual-min.png',
      short: 'Maßgeschneiderte Lösung mit speziellen Features. Für komplexe Anforderungen.',
      features: [
        'Unbegrenzte Seiten',
        'Custom Features',
        'API-Integrationen',
        'Mitgliederbereiche',
        'Premium-Support'
      ],
      badge: '💎 Premium',
      price: 'ab 5.000 €',
      cta: 'Beratung anfragen',
      route: 'individual-website',
    },
    {
      title: 'SEO Optimierung',
      slug: 'seo-optimization',
      img: 'assets/cards/4-min.png',
      short: 'Bestehende Website für Google optimieren. Bessere Rankings, mehr Besucher.',
      features: [
        'Technisches SEO',
        'Keyword-Analyse',
        'Content-Optimierung',
        'Performance-Boost',
        'Monatliches Reporting'
      ],
      badge: '🔥 Neu',
      price: 'ab 490 €/Monat',
      route: 'seo-optimization',
      cta: 'Pakete ansehen'
    },
  ];

  constructor() { }

  getServices(): ServiceItem[] {
    return this.services;
  }

  getServiceBySlug(slug: string): ServiceItem | undefined {
    return this.services.find(service => service.slug === slug);
  }
}
