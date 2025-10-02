import { Injectable } from '@angular/core';

export interface ServiceItem {
  title: string;
  slug: string;
  img: string;
  short?: string;
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
      short: 'Eine einzelne Seite mit den wichtigsten Informationen. Der geringste Aufwand.',
      price: 'ab 1.799 €',
      cta: 'Zum Paket',
      route: 'one-pager',
    },
    {
      title: 'Standard Webseite',
      slug: 'standard-website',
      img: 'assets/cards/standard-min.png',
      short: 'Eine Website mit mehreren Seiten für mehr Inhalte und Struktur. Mittlerer Aufwand.',
      price: 'ab 3.499 €',
      cta: 'Zum Paket',
      route: 'standard-website',
    },
    {
      title: 'Individual Webseite',
      slug: 'individual-website',
      img: 'assets/cards/individual-min.png',
      short: 'Eine individuell entwickelte Website mit erweitertem Funktionsumfang. Höchster Aufwand.',
      price: 'ab 4.999 €',
      cta: 'Zum Paket',
      route: 'individual-website',
    },

    // {
    //   title: 'All-in-One-Lösung',
    //   slug: 'all-in-one',
    //   img: 'assets/cards/2.png',
    //   short: 'Hosting, Domain, Website - Alles in einem Paket.',
    //   price: 'ab 2.500 €',
    //   route: 'all-in-one',
    //   cta: 'Details & Beispiele',
    // },
    // {
    //   title: 'Große Website (3-8 Seiten)',
    //   slug: 'large-website',
    //   img: 'assets/cards/3.png',
    //   short: 'Strukturierte Inhalte, SEO-Basics & DSGVO.',
    //   price: 'ab 3.200 €',
    //   route: 'large-website',
    //   cta: 'Details & Preise'
    // },
    {
      title: 'SEO Optimierung',
      slug: 'seo-optimization',
      img: 'assets/cards/4-min.png',
      short: 'Optimierung für Google & Co.',
      price: 'ab 490€',
      route: 'seo-optimization',
      cta: 'Leistungspakete ansehen'
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
