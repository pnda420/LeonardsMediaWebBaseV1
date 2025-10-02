import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';
import { ServiceDataService, ServiceItem } from '../../shared/service-data.service';


type PackageSlug = 'one-pager' | 'standard-website' | 'individual-website';

@Component({
  selector: 'app-one-pager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})

export class SurveyComponent {
  form: ReturnType<FormBuilder['group']>;
  packages: ReturnType<ServiceDataService['getServices']>;

  constructor(private fb: FormBuilder, public router: Router, private serviceDataService: ServiceDataService) {
    this.packages = this.serviceDataService.getServices();
    this.form = this.fb.group({
      // Step 0
      projectType: this.fb.control<'one' | 'multi' | 'custom' | null>(null, Validators.required),

      // Step 1
      contentAmount: this.fb.control<'very-low' | 'low' | 'medium' | 'high' | null>(null, Validators.required),

      // Step 2
      hasDomain: this.fb.control<'yes' | 'no' | 'unsure' | null>(null, Validators.required),
      domainName: this.fb.control<string>(''),

      // Step 3
      hosting: this.fb.control<'self' | 'with-me' | 'unsure' | null>(null, Validators.required),
      hostingProvider: this.fb.control<string>(''),

      // Step 4
      features: this.fb.group({
        startSection: this.fb.control<boolean>(true),       // Startbereich / erster Eindruck
        about: this.fb.control<boolean>(false),             // Über mich / Über uns
        services: this.fb.control<boolean>(false),          // Leistungen / Angebote
        gallery: this.fb.control<boolean>(false),           // Bildergalerie / Projekte
        team: this.fb.control<boolean>(false),              // Teamvorstellung
        testimonials: this.fb.control<boolean>(false),      // Kundenstimmen / Bewertungen
        contactForm: this.fb.control<boolean>(false),       // Kontaktformular
        map: this.fb.control<boolean>(false),               // Standortkarte
        faq: this.fb.control<boolean>(false),               // Häufige Fragen (FAQ)
        pricing: this.fb.control<boolean>(false),           // Preise / Tarife
        blog: this.fb.control<boolean>(false),              // News / Blog
        booking: this.fb.control<boolean>(false),           // Terminbuchung
        downloads: this.fb.control<boolean>(false),         // Downloads (PDFs, Broschüren)
        newsletter: this.fb.control<boolean>(false),        // Newsletter-Anmeldung
        multilingual: this.fb.control<boolean>(false),      // Mehrsprachigkeit
        socialLinks: this.fb.control<boolean>(false),       // Social Media Links
      }),


      // Step 5
      budget: this.fb.control<'<2k' | '2-4k' | '4-7k' | '>7k' | 'unsure' | null>(null, Validators.required),
      timeframe: this.fb.control<'fast' | 'normal' | 'flex' | null>(null, Validators.required),

      // Step 6
      contactName: this.fb.control<string>('', [Validators.required, Validators.minLength(2)]),
      contactEmail: this.fb.control<string>('', [Validators.required, Validators.email]),
      notes: this.fb.control<string>(''),
    });

    // Keep current step valid on start
    this.goToStep(0);
    // optional: live debug in console
    effect(() => {
      // console.log('answers', this.answers());
      // console.log('recommendation', this.recommendation());
    });
  }

  // ---- Stepper State ----
  step = signal(0);
  maxStepReached = signal(0);
  steps = [
    'Was brauchst du?',
    'Wie viel Inhalt?',
    'Domain',
    'Hosting',
    'Funktionen',
    'Budget & Zeit',
    'Kontakt & Ereignis',
  ];

  goToStep(i: number) {
    const last = Math.max(this.maxStepReached(), i);
    this.step.set(i);
    this.maxStepReached.set(last);
  }

  next() {
    if (this.step() < this.steps.length - 1) this.step.update((v) => v + 1);
  }
  prev() {
    if (this.step() > 0) this.step.update((v) => v - 1);
  }

  // ---- Form / Antworten ----
  // (form is already initialized in the constructor)

  // Convenience accessor for template
  get featuresGroup() {
    return this.form.get('features')!;
  }

  answers = computed(() => this.form.getRawValue());

  // ---- Regelbasierte Empfehlung ----
  recommendation = computed<{
    pkg: ServiceItem | null;
    reasons: string[];
    confidence: 'low' | 'medium' | 'high';
  }>(() => {
    const a = this.answers();

    const wantsShopOrComplex =
      a.features?.shop ||
      a.features?.memberArea ||
      a.features?.booking ||
      a.features?.integrations === true;

    const manyPages =
      a.projectType === 'multi' ||
      a.contentAmount === 'medium' ||
      a.contentAmount === 'high';

    const minimalContent = a.projectType === 'one' || a.contentAmount === 'very-low' || a.contentAmount === 'low';

    let slug: PackageSlug | null = null;
    const reasons: string[] = [];

    if (wantsShopOrComplex) {
      slug = 'individual-website';
      reasons.push('Spezielle Funktionen (Shop/Account/Buchung/Integrationen).');
    } else if (manyPages) {
      slug = 'standard-website';
      reasons.push('Mehrere Seiten bzw. mittlere Menge an Inhalten.');
    } else if (minimalContent) {
      slug = 'one-pager';
      reasons.push('Wenige Inhalte – eine klare Seite reicht.');
    }

    // Budget als Sekundärsignal
    if (a.budget === '<2k' && slug && slug !== 'one-pager') {
      reasons.push('Budget ist knapp – ggf. mit kleinerem Umfang starten.');
    }
    if ((a.budget === '4-7k' || a.budget === '>7k') && slug === 'one-pager' && wantsShopOrComplex) {
      slug = 'individual-website';
    }

    // Confidence heuristisch
    const confidence: 'low' | 'medium' | 'high' =
      wantsShopOrComplex ? 'high' : manyPages ? 'medium' : 'medium';

    const pkg = slug ? this.packages.find((p) => p.slug === slug) ?? null : null;
    return { pkg, reasons, confidence };
  });

  // ---- Abschluss / Senden ----
  get summary() {
    const a = this.answers();
    const rec = this.recommendation();
    return {
      projekt: a.projectType,
      inhalte: a.contentAmount,
      domain: {
        status: a.hasDomain,
        name: (a.domainName || '').trim() || null,
      },
      hosting: {
        wunsch: a.hosting,
        provider: (a.hostingProvider || '').trim() || null,
      },
      funktionen: a.features,
      budget: a.budget,
      zeitrahmen: a.timeframe,
      kontakt: {
        name: a.contactName,
        email: a.contactEmail,
        notizen: a.notes?.trim() || null,
      },
      empfehlung: rec.pkg?.slug ?? null,
      begruendung: rec.reasons,
      sicherheit: rec.confidence,
      timestamp: new Date().toISOString(),
    };
  }

  submit() {
    if (this.form.invalid) {
      // naive Fokus auf erstes ungültiges Feld
      const firstInvalid = document.querySelector('[data-invalid="true"]') as HTMLElement | null;
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // -> Hier an dein Backend senden
    // z.B. this.http.post('/api/survey', this.summary).subscribe(...)
    console.log('Survey Summary:', this.summary);

    // Weiterleitung auf Kontakt / Paket
    const route = this.recommendation().pkg?.route ?? 'services';
    this.router.navigate([`/${route}`], { queryParams: { from: 'survey' } });
  }
}
