import { Injectable } from '@angular/core';

export interface ServiceItem {
  title: string;
  slug: string;
  img: string;
  short?: string;
  price?: string;
  cta?: string;
  // Zukünftige, detailliertere Inhalte können hier hinzugefügt werden
  details?: { 
    description: string;
    features: string[];
  };
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
      details: {
        description: 'Der One-Pager ist die perfekte Visitenkarte im Web. Alle wichtigen Informationen werden kompakt und ansprechend auf einer einzigen Seite präsentiert. Ideal für Start-ups, Freiberufler oder projektbezogene Landingpages.',
        features: ['Modernes, responsives Design', 'Kontaktformular', 'SEO-Grundlagen', 'DSGVO-konform']
      }
    },
    {
      title: 'All-in-One-Lösung',
      slug: 'all-in-one',
      img: 'assets/cards/2.png',
      short: 'Hosting, Domain, Website - Alles in einem Paket.',
      price: 'ab 2.500 €',
      cta: 'Details & Beispiele',
      details: {
        description: 'Machen Sie es sich einfach. Mit der All-in-One-Lösung kümmern wir uns um die gesamte technische Abwicklung von der Domain-Registrierung über das Hosting bis zur fertigen Website. Sie erhalten alles aus einer Hand und haben einen zentralen Ansprechpartner.',
        features: ['Inklusive Domain (.de, .com, .eu)', 'Sicheres & schnelles Hosting für 1 Jahr', 'Professionelle E-Mail-Adressen', 'Regelmäßige Backups']
      }
    },
    {
      title: 'Große Website (3–8 Seiten)',
      slug: 'large-website',
      img: 'assets/cards/3.png',
      short: 'Strukturierte Inhalte, SEO-Basics & DSGVO.',
      price: 'ab 3.200 €',
      cta: 'Details & Preise',
      details: {
        description: 'Für Unternehmen, die mehr zu sagen haben. Wir strukturieren Ihre Inhalte auf mehreren Unterseiten (z.B. Über uns, Leistungen, Team, Kontakt) und schaffen so eine übersichtliche und professionelle Online-Präsenz, die bei Kunden und Suchmaschinen gut ankommt.',
        features: ['Bis zu 8 individuelle Unterseiten', 'Content-Management-System (CMS) zur Eigenpflege', 'Erweiterte SEO-Optimierung', 'Blog-Funktionalität möglich']
      }
    },
    {
      title: 'SEO Optimierung',
      slug: 'seo-optimization',
      img: 'assets/cards/4.png',
      short: 'Optimierung für Google & Co.',
      price: 'ab 490€',
      cta: 'Leistungspakete ansehen',
      details: {
        description: 'Eine schöne Website ist nur die halbe Miete. Damit Sie von potenziellen Kunden auch gefunden werden, optimieren wir Ihre Seite für Suchmaschinen wie Google. Wir analysieren Ihre Zielgruppe und Keywords und setzen technische sowie inhaltliche Maßnahmen um.',
        features: ['Keyword-Analyse', 'On-Page-Optimierung (Texte, Metadaten)', 'Technische SEO (Ladezeit, Mobilfreundlichkeit)', 'Reporting und Monitoring']
      }
    },
    {
      title: 'Full Back & Frontend Web-Entwicklung',
      slug: 'full-stack-development',
      img: 'assets/cards/5.png',
      short: 'Komplette Web-Anwendung mit moderner Frontend- und Backend-Technologie.',
      price: 'ab 5.000 €',
      cta: 'Details & Preise',
      details: {
        description: 'Sie haben eine Idee für eine individuelle Web-Anwendung, ein Portal oder eine komplexe Plattform? Wir setzen Ihre Vision mit modernen Technologien um. Vom interaktiven Frontend mit Angular oder React bis zum robusten Backend mit Node.js oder .NET – wir entwickeln maßgeschneiderte Lösungen.',
        features: ['Individuelle Anwendungslogik', 'Datenbankanbindung (SQL/NoSQL)', 'API-Entwicklung', 'Skalierbare Architektur']
      }
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
