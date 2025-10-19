// Interface für die Service-Konfiguration
export interface ServiceConfig {
  // Meta-Daten
  pageTitle: string;
  slug: string;
  
  // Hero Section
  hero: {
    badge: {
      icon: string;
      text: string;
      variant?: 'primary' | 'star' | 'premium';
    };
    title: string;
    description: string;
    image: string;
    facts: {
      price: string;
      timeline: string;
      highlight: string;
    };
    guarantee: string;
  };
  
  // Optional: KI-Box oder Comparison-Box
  infoBox?: {
    type: 'ki' | 'comparison';
    title: string;
    content?: string;
    items?: {
      title: string;
      features: string[];
      highlight?: boolean;
    }[];
  };
  
  // Optional: Typical Pages (nur für Standard)
  typicalPages?: {
    icon: string;
    title: string;
    description: string;
  }[];
  
  // Optional: Use Cases (nur für Individual)
  useCases?: {
    icon: string;
    title: string;
    description: string;
  }[];
  
  // Optional: Tech Stack (nur für Individual)
  techStack?: {
    category: string;
    technologies: string[];
  }[];
  
  // Fit Check
  fit: {
    good: {
      title: string;
      items: string[];
    };
    warning: {
      title: string;
      items: string[];
      note?: string;
    };
  };
  
  // Was du bekommst
  includes: {
    title: string;
    text: string;
  }[];
  
  // Ablauf
  process: {
    number: string;
    title: string;
    description: string;
  }[];
  
  // FAQ
  faq: {
    q: string;
    a: string[];
  }[];
  
  // CTA
  cta: {
    title: string;
    description: string;
    benefits: string[];
  };
}