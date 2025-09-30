import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

/* ========= Gemeinsame Primitives ========= */

export type MainType = 'landing' | 'portfolio' | 'event';
export type CtaKind = 'primary' | 'ghost';

export interface SeoMeta {
  title?: string;        // <= ~70 Zeichen
  description?: string;  // <= ~160 Zeichen
}

export interface ImageRef {
  src: string;
  alt?: string;
}

export interface Cta {
  label: string;
  route?: string;   // interne Route
  href?: string;    // externe URL, mailto:, tel:
  kind?: CtaKind;
}

export interface LinkRef {
  label: string;
  route?: string;
  href?: string;
}

/* ========= Block-Basis ========= */

interface BlockBase<T extends string> {
  type: T;
  enabled?: boolean;
}

/* ========= Gemeinsame Blöcke (mehrfach verwendbar) ========= */

// HERO (für alle Typen; Event kann datetime/location zusätzlich setzen)
export interface HeroBlock extends BlockBase<'hero'> {
  title: string;
  subtitle?: string;
  image?: ImageRef;
  ctas?: Cta[];
  // Event-spezifische Felder (optional, ignorierbar bei anderen Typen)
  datetime?: { start: string; end?: string }; // ISO 8601
  location?: { name: string; address?: string };
}

// Value Props (Landing)
export interface ValuePropsBlock extends BlockBase<'valueProps'> {
  items: Array<{ icon?: string; title: string; text: string }>;
}

// Features (Landing, optional)
export interface FeaturesBlock extends BlockBase<'features'> {
  items: Array<{ title: string; text: string; icon?: string; image?: ImageRef }>;
}

// Social Proof (Landing/Portfolio optional)
export interface SocialProofBlock extends BlockBase<'socialProof'> {
  logos?: ImageRef[];
  testimonials?: Array<{ quote: string; name: string; role?: string }>;
}

// Pricing (Landing/Event: Tickets ist separater Block)
export interface PricingBlock extends BlockBase<'pricing'> {
  note?: string;
  plans: Array<{
    name: string;
    price: string;
    desc?: string;
    features?: string[];
    cta?: Cta;
  }>;
}

// Lead Capture (Landing optional)
export interface LeadCaptureBlock extends BlockBase<'leadCapture'> {
  headline: string;
  intro?: string;
  form: {
    fields: Array<{
      name: string;
      label: string;
      type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
      required?: boolean;
      options?: string[]; // für select
      placeholder?: string;
    }>;
    submit: Cta; // route oder href
  };
}

// FAQ (alle Typen optional)
export interface FaqBlock extends BlockBase<'faq'> {
  items: Array<{ q: string; a: string[] }>;
}

// Abschluss-CTA (alle Typen)
export interface CtaSectionBlock extends BlockBase<'cta'> {
  title: string;
  subtitle?: string;
  primary: Cta;
  secondary?: Cta;
}

/* ========= Portfolio-spezifische Blöcke ========= */

export interface SkillsBlock extends BlockBase<'skills'> {
  items: string[]; // kurze Stichworte
}

export interface ProjectsBlock extends BlockBase<'projects'> {
  items: Array<{
    title: string;
    summary: string;
    tags?: string[];
    image?: ImageRef;
    links?: LinkRef[];
  }>;
}

export interface AboutBlock extends BlockBase<'about'> {
  title?: string;
  text: string;
  facts?: Array<{ k: string; v: string }>;
}

export interface ServicesBlock extends BlockBase<'services'> {
  items: Array<{ title: string; text: string }>;
}

export interface ContactBlock extends BlockBase<'contact'> {
  headline: string;
  text?: string;
  channels: Array<{
    type: 'tel' | 'mail' | 'link';
    label: string;
    value: string; // Nummer, E-Mail oder URL
  }>;
}

/* ========= Event-spezifische Blöcke ========= */

export interface ScheduleBlock extends BlockBase<'schedule'> {
  items: Array<{ time: string; title: string; desc?: string; track?: string }>;
}

export interface SpeakersBlock extends BlockBase<'speakers'> {
  items: Array<{
    name: string;
    role?: string;
    bio?: string;
    photo?: ImageRef;
    links?: LinkRef[];
  }>;
}

export interface VenueBlock extends BlockBase<'venue'> {
  map?: { embedUrl?: string; staticImg?: ImageRef };
  notes?: string;
}

export interface TicketsBlock extends BlockBase<'tickets'> {
  plans: Array<{
    name: string;
    price: string;
    desc?: string;
    cta: Cta; // typischerweise href zu Ticketseite
  }>;
}

/* ========= Block-Unions pro Seitentyp ========= */

export type LandingBlock =
  | HeroBlock
  | ValuePropsBlock
  | FeaturesBlock
  | SocialProofBlock
  | PricingBlock
  | LeadCaptureBlock
  | FaqBlock
  | CtaSectionBlock;

export type PortfolioBlock =
  | HeroBlock
  | SkillsBlock
  | ProjectsBlock
  | AboutBlock
  | ServicesBlock
  | SocialProofBlock
  | ContactBlock
  | FaqBlock
  | CtaSectionBlock;

export type EventBlock =
  | HeroBlock
  | ScheduleBlock
  | SpeakersBlock
  | VenueBlock
  | TicketsBlock
  | FaqBlock
  | CtaSectionBlock;

export type AnyBlock =
  | HeroBlock | ValuePropsBlock | FeaturesBlock | SocialProofBlock
  | PricingBlock | LeadCaptureBlock | FaqBlock | CtaSectionBlock
  | SkillsBlock | ProjectsBlock | AboutBlock | ServicesBlock | ContactBlock
  | ScheduleBlock | SpeakersBlock | VenueBlock | TicketsBlock;

/* ========= Main-Root (discriminated union) ========= */

export interface MainLanding {
  type: 'landing';
  blocks: LandingBlock[];
  seo?: SeoMeta;
}

export interface MainPortfolio {
  type: 'portfolio';
  blocks: PortfolioBlock[];
  seo?: SeoMeta;
}

export interface MainEvent {
  type: 'event';
  blocks: EventBlock[];
  seo?: SeoMeta;
}

export type MainContent = MainLanding | MainPortfolio | MainEvent;

@Component({
  selector: 'app-preview-content',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {
  @Input({ required: true }) model!: MainContent;

  is = {
    hero: (b: AnyBlock): b is HeroBlock => b.type === 'hero',
    valueProps: (b: AnyBlock): b is ValuePropsBlock => b.type === 'valueProps',
    features: (b: AnyBlock): b is FeaturesBlock => b.type === 'features',
    socialProof: (b: AnyBlock): b is SocialProofBlock => b.type === 'socialProof',
    pricing: (b: AnyBlock): b is PricingBlock => b.type === 'pricing',
    leadCapture: (b: AnyBlock): b is LeadCaptureBlock => b.type === 'leadCapture',
    faq: (b: AnyBlock): b is FaqBlock => b.type === 'faq',
    cta: (b: AnyBlock): b is CtaSectionBlock => b.type === 'cta',

    skills: (b: AnyBlock): b is SkillsBlock => b.type === 'skills',
    projects: (b: AnyBlock): b is ProjectsBlock => b.type === 'projects',
    about: (b: AnyBlock): b is AboutBlock => b.type === 'about',
    services: (b: AnyBlock): b is ServicesBlock => b.type === 'services',
    contact: (b: AnyBlock): b is ContactBlock => b.type === 'contact',

    schedule: (b: AnyBlock): b is ScheduleBlock => b.type === 'schedule',
    speakers: (b: AnyBlock): b is SpeakersBlock => b.type === 'speakers',
    venue: (b: AnyBlock): b is VenueBlock => b.type === 'venue',
    tickets: (b: AnyBlock): b is TicketsBlock => b.type === 'tickets',
  };

  toHero(b: AnyBlock): HeroBlock | null { return this.is.hero(b) ? b : null; }
  toValueProps(b: AnyBlock): ValuePropsBlock | null { return this.is.valueProps(b) ? b : null; }
  toFeatures(b: AnyBlock): FeaturesBlock | null { return this.is.features(b) ? b : null; }
  toSocialProof(b: AnyBlock): SocialProofBlock | null { return this.is.socialProof(b) ? b : null; }
  toPricing(b: AnyBlock): PricingBlock | null { return this.is.pricing(b) ? b : null; }
  toLead(b: AnyBlock): LeadCaptureBlock | null { return this.is.leadCapture(b) ? b : null; }
  toFaq(b: AnyBlock): FaqBlock | null { return this.is.faq(b) ? b : null; }
  toCta(b: AnyBlock): CtaSectionBlock | null { return this.is.cta(b) ? b : null; }

  toSkills(b: AnyBlock): SkillsBlock | null { return this.is.skills(b) ? b : null; }
  toProjects(b: AnyBlock): ProjectsBlock | null { return this.is.projects(b) ? b : null; }
  toAbout(b: AnyBlock): AboutBlock | null { return this.is.about(b) ? b : null; }
  toServices(b: AnyBlock): ServicesBlock | null { return this.is.services(b) ? b : null; }
  toContact(b: AnyBlock): ContactBlock | null { return this.is.contact(b) ? b : null; }

  toSchedule(b: AnyBlock): ScheduleBlock | null { return this.is.schedule(b) ? b : null; }
  toSpeakers(b: AnyBlock): SpeakersBlock | null { return this.is.speakers(b) ? b : null; }
  toVenue(b: AnyBlock): VenueBlock | null { return this.is.venue(b) ? b : null; }
  toTickets(b: AnyBlock): TicketsBlock | null { return this.is.tickets(b) ? b : null; }


  constructor(public router: Router, private san: DomSanitizer) { }

  get blocks(): ReadonlyArray<AnyBlock> {
    return (this.model?.blocks ?? []) as AnyBlock[];
  }

  navigate(cta?: Cta) {
    if (!cta) return;
    if (cta.route) this.router.navigate([cta.route]);
    else if (cta.href) window.open(cta.href, cta.href.startsWith('http') ? '_blank' : '_self');
  }

  safeUrl(u?: string): SafeResourceUrl | null {
    return u ? this.san.bypassSecurityTrustResourceUrl(u) : null;
  }

  trackByIdx = (_: number, __: unknown) => _;

  // Provide a consistently typed iterable for the template to avoid array-of-unions issue
  get allBlocks(): AnyBlock[] {
    return (this.model?.blocks ?? []) as AnyBlock[];
  }
}
