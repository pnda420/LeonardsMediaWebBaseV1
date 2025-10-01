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
      title: 'Website One-Pager',
      slug: 'one-pager',
      img: 'assets/cards/1.png',
      short: 'Einfache Website mit modernem Design und moderner Technologie.',
      price: 'ab 1.800 €',
      cta: 'Details & Beispiele',
      route: 'one-pager',
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
      img: 'assets/cards/4.png',
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
