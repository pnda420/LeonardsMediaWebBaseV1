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
    title: 'Starter',
    slug: 'starter',
    img: 'assets/cards/simple-min.png',
    short: 'Deine erste Website. Alles auf einer Seite, genau wie du es brauchst.',
    features: [
      'Fertig in 1-2 Wochen',
      'Alle Bereiche die du willst',
      'Auf Handy perfekt',
      'Kontaktformular',
      'Bei Google findbar',
      'Deine Farben & Texte',
      '3 Monate Support gratis'
    ],
    badge: '🚀 Schnellstart',
    price: 'ab 1.490 € ',
    cta: 'Mehr erfahren',
    route: 'one-pager',
  },
  {
    title: 'Business',
    slug: 'business',
    img: 'assets/cards/standard-min.png',
    short: 'Mehrere Seiten für dein Angebot. Komplett nach deinen Wünschen gebaut.',
    features: [
      'Fertig in 2-4 Wochen',
      'So viele Seiten wie du brauchst',
      'Blog oder News-Bereich',
      'Mehrere Kontaktformulare',
      'Volle Google-Optimierung',
      'Alle Texte & Bilder von dir',
      'Spezielle Features möglich',
      '6 Monate Support gratis'
    ],
    badge: '⭐ Am beliebtesten',
    price: 'ab 2.490 € ',
    cta: 'Mehr erfahren',
    route: 'standard-website',
  },
  {
    title: 'Premium',
    slug: 'premium',
    img: 'assets/cards/individual-min.png',
    short: 'Komplette Design-Freiheit. Ich baue genau das, was du dir vorstellst.',
    features: [
      'Keine Limits bei Seiten',
      'Login für Mitglieder',
      'Buchungssystem möglich',
      'Kalender-Integration',
      'Eigene Spezial-Funktionen',
      'Anbindung zu anderen Tools',
      'Interaktive Elemente',
      'Animationen & Effekte',
      '12 Monate Premium-Support'
    ],
    badge: '💎 Individuell',
    price: 'ab 3.990 € ',
    cta: 'Mehr erfahren',
    route: 'individual-website',
  }
];

  constructor() { }

  getServices(): ServiceItem[] {
    return this.services;
  }

  getServiceBySlug(slug: string): ServiceItem | undefined {
    return this.services.find(service => service.slug === slug);
  }
}
