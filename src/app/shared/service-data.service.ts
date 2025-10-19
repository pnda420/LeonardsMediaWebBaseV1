import { Injectable } from '@angular/core';
import { SERVICE_CONFIGS } from '../components/services/common-service/service.config';

export interface ServiceItem {
  title: string;
  slug: string;
  badge: {
    icon: string;
    text: string;
  };
  price: string;
  short: string;
  features: string[];
  route: string;
  cta: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceDataService {

  constructor() { }

  /**
   * Generiert ServiceItems aus den SERVICE_CONFIGS
   * Automatisch aus der zentralen Konfiguration
   */
  getServices(): ServiceItem[] {
    const services: ServiceItem[] = [];

    // One-Pager Service
    if (SERVICE_CONFIGS['one-pager']) {
      const config = SERVICE_CONFIGS['one-pager'];
      services.push({
        title: config.pageTitle,
        slug: config.slug,
        badge: { icon: config.hero.badge.icon, text: config.hero.badge.text },
        price: config.hero.facts.price,
        short: this.stripHtml(config.hero.description),
        features: this.extractFeatures(config, 4), // Erste 4 Features
        route: `/services/${config.slug}`,
        cta: 'Mehr erfahren'
      });
    }

    // Standard Website Service
    if (SERVICE_CONFIGS['standard-website']) {
      const config = SERVICE_CONFIGS['standard-website'];
      services.push({
        title: config.pageTitle,
        slug: config.slug,
        badge: { icon: config.hero.badge.icon, text: config.hero.badge.text },
        price: config.hero.facts.price,
        short: this.stripHtml(config.hero.description),
        features: this.extractFeatures(config, 4),
        route: `/services/${config.slug}`,
        cta: 'Mehr erfahren'
      });
    }

    // Individual Website Service
    if (SERVICE_CONFIGS['individual-website']) {
      const config = SERVICE_CONFIGS['individual-website'];
      services.push({
        title: config.pageTitle,
        slug: config.slug,
        badge: { icon: config.hero.badge.icon, text: config.hero.badge.text },
        price: config.hero.facts.price,
        short: this.stripHtml(config.hero.description),
        features: this.extractFeatures(config, 4),
        route: `/services/${config.slug}`,
        cta: 'Mehr erfahren'
      });
    }

    return services;
  }

  /**
   * Holt einen einzelnen Service nach Slug
   */
  getServiceBySlug(slug: string): ServiceItem | undefined {
    return this.getServices().find(s => s.slug === slug);
  }

  /**
   * Extrahiert Features aus der Config
   * Nimmt die wichtigsten Features aus fit.good oder includes
   */
  private extractFeatures(config: any, limit: number = 4): string[] {
    const features: string[] = [];

    // Versuche zuerst aus fit.good
    if (config.fit?.good?.items) {
      features.push(...config.fit.good.items.slice(0, limit));
    }

    // Falls nicht genug, nehme aus includes
    if (features.length < limit && config.includes) {
      const remaining = limit - features.length;
      const includesTitles = config.includes
        .slice(0, remaining)
        .map((inc: any) => this.stripHtml(inc.title));
      features.push(...includesTitles);
    }

    // Begrenze auf gewünschte Anzahl
    return features.slice(0, limit).map(f => this.stripHtml(f));
  }

  /**
   * Entfernt HTML-Tags aus Strings
   */
  private stripHtml(html: string): string {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  /**
   * Optional: Vordefinierte Features falls du die manuelle Kontrolle willst
   */
  private getCustomFeatures(slug: string): string[] {
    const customFeatures: { [key: string]: string[] } = {
      'one-pager': [
        'Fertig in 1-2 Wochen',
        'Ein klares Angebot',
        'Mobile optimiert',
        'SEO-Grundlagen inklusive'
      ],
      'standard-website': [
        '3-8 Unterseiten',
        'Blog-System optional',
        'Erweiterte SEO',
        'Professionelle Navigation'
      ],
      'individual-website': [
        'Custom Features',
        'API-Integrationen',
        'Login-Systeme',
        'Vollständige Datenbank'
      ]
    };

    return customFeatures[slug] || [];
  }

  /**
   * Optional: Wenn du die Features manuell definieren willst statt automatisch
   */
  getServicesWithCustomFeatures(): ServiceItem[] {
    return this.getServices().map(service => {
      const customFeatures = this.getCustomFeatures(service.slug);
      if (customFeatures.length > 0) {
        service.features = customFeatures;
      }
      return service;
    });
  }
}