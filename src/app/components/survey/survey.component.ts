import { Component, Signal, computed, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, startWith } from 'rxjs';
import { ServiceDataService, ServiceItem } from '../../shared/service-data.service';
import { ApiService, CreateContactRequestDto, ServiceType } from '../../api/api.service';
import { ToastService } from '../../shared/toasts/toast.service';

type PackageSlug = 'one-pager' | 'standard-website' | 'individual-website';

interface QuestionOption {
  value: string;
  label: string;
  hint?: string;
  icon?: string;
}

interface Question {
  title: string;
  subtitle?: string;
  icon: string;
  type: 'single-choice' | 'multiple-choice' | 'combined' | 'contact';
  formKey: string;
  layout?: 'cards' | 'list' | 'grid';
  options?: QuestionOption[];
  resetFields?: string[];
  conditionalInput?: {
    showWhen: string;
    formKey: string;
    label: string;
    placeholder: string;
  };
  sections?: Array<{
    label: string;
    formKey: string;
    layout: 'grid' | 'list';
    options: QuestionOption[];
  }>;
  fields?: Array<{
    label: string;
    placeholder: string;
  }>;
}

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent {
  form!: ReturnType<FormBuilder['group']>;
  private formValue!: Signal<any>;

  packages: ReturnType<ServiceDataService['getServices']>;

  // NEU: State für Success-View
  isSubmitted = signal(false);
  isSubmitting = signal(false);

  questions: Question[] = [
    {
      title: 'Was passt grob zu deinem Vorhaben?',
      subtitle: 'Wähle die Variante, die am besten zu deinem Projekt passt.',
      icon: '🎯',
      type: 'single-choice',
      formKey: 'projectType',
      layout: 'cards',
      options: [
        { value: 'one', label: 'Eine einfache Seite', hint: 'Perfekt für schnelle Präsenz - alles auf einer Seite', icon: '📄' },
        { value: 'multi', label: 'Mehrere Seiten', hint: 'Klassische Website mit verschiedenen Unterseiten', icon: '📑' },
        { value: 'custom', label: 'Etwas Individuelles', hint: 'Spezielle Features, Datenbanken, komplexe Funktionen', icon: '⚙️' }
      ]
    },
    {
      title: 'Wie viel Inhalt ist geplant?',
      subtitle: 'Eine grobe Einschätzung reicht völlig aus.',
      icon: '📊',
      type: 'single-choice',
      formKey: 'contentAmount',
      layout: 'list',
      options: [
        { value: 'very-low', label: 'Sehr wenig', hint: '1–2 Absätze, z.B. Startseite mit Kontaktdaten' },
        { value: 'low', label: 'Wenig', hint: '3–5 Abschnitte, z.B. Start, Über mich, Leistungen, Kontakt' },
        { value: 'medium', label: 'Mittel', hint: '6–10 Abschnitte oder Seiten, z.B. Portfolio, Team, FAQ' },
        { value: 'high', label: 'Viel', hint: 'Mehr als 10 Seiten, z.B. Blog, viele Unterseiten' }
      ]
    },
    {
      title: 'Hast du bereits eine Domain?',
      subtitle: 'Eine Domain ist deine Website-Adresse (z.B. meinefirma.de)',
      icon: '🌐',
      type: 'single-choice',
      formKey: 'hasDomain',
      layout: 'list',
      options: [
        { value: 'yes', label: 'Ja, ich habe schon eine Domain' },
        { value: 'no', label: 'Nein, ich brauche noch eine Domain' },
        { value: 'unsure', label: 'Weiß ich noch nicht' }
      ],
      resetFields: ['domainName'],
      conditionalInput: {
        showWhen: 'yes',
        formKey: 'domainName',
        label: 'Wie lautet deine Domain?',
        placeholder: 'z.B. meinefirma.de'
      }
    },
    {
      title: 'Wo soll die Website gehostet werden?',
      subtitle: 'Hosting bedeutet, wo deine Website technisch liegt und erreichbar ist.',
      icon: '☁️',
      type: 'single-choice',
      formKey: 'hosting',
      layout: 'list',
      options: [
        { value: 'with-me', label: 'Bitte bei dir hosten', hint: 'Ich kümmere mich um alles - du brauchst dich nicht damit befassen' },
        { value: 'self', label: 'Ich hoste selbst', hint: 'Ich habe bereits einen Hosting-Anbieter' },
        { value: 'unsure', label: 'Weiß ich noch nicht', hint: 'Lass uns das zusammen klären' }
      ],
      resetFields: ['hostingProvider'],
      conditionalInput: {
        showWhen: 'self',
        formKey: 'hostingProvider',
        label: 'Bei welchem Anbieter hostest du?',
        placeholder: 'z.B. IONOS, netcup, all-inkl'
      }
    },
    {
      title: 'Welche Funktionen brauchst du?',
      subtitle: 'Wähle alle Funktionen aus, die deine Website haben soll. Mehrfachauswahl möglich.',
      icon: '✨',
      type: 'multiple-choice',
      formKey: 'features',
      options: [
        { value: 'startSection', label: 'Startbereich', hint: 'Großes Bild / Hero-Überschrift' },
        { value: 'about', label: 'Über mich / uns', hint: 'Vorstellung des Unternehmens' },
        { value: 'services', label: 'Leistungen / Angebote', hint: 'Was du anbietest' },
        { value: 'gallery', label: 'Bildergalerie', hint: 'Portfolio, Referenzen, Projekte' },
        { value: 'team', label: 'Teamvorstellung', hint: 'Mitarbeiter mit Fotos & Infos' },
        { value: 'testimonials', label: 'Kundenstimmen', hint: 'Bewertungen & Referenzen' },
        { value: 'contactForm', label: 'Kontaktformular', hint: 'Direkte Anfragen über die Website' },
        { value: 'map', label: 'Standortkarte', hint: 'Google Maps Integration' },
        { value: 'faq', label: 'FAQ', hint: 'Häufig gestellte Fragen' },
        { value: 'pricing', label: 'Preise / Tarife', hint: 'Preisübersicht oder Pakete' },
        { value: 'blog', label: 'Blog / News', hint: 'Regelmäßige Artikel & Updates' },
        { value: 'booking', label: 'Terminbuchung', hint: 'Online Termine vereinbaren' },
        { value: 'downloads', label: 'Downloads', hint: 'PDFs, Broschüren, Dokumente' },
        { value: 'newsletter', label: 'Newsletter', hint: 'E-Mail-Anmeldung für Updates' },
        { value: 'multilingual', label: 'Mehrsprachigkeit', hint: 'Website in mehreren Sprachen' },
        { value: 'socialLinks', label: 'Social Media', hint: 'Links zu Instagram, Facebook, etc.' }
      ]
    },
    {
      title: 'Budget & Zeitrahmen',
      subtitle: 'Hilft mir, dir ein realistisches Angebot zu machen.',
      icon: '💰',
      type: 'combined',
      formKey: 'combined',
      sections: [
        {
          label: 'Budgetrahmen',
          formKey: 'budget',
          layout: 'grid',
          options: [
            { value: '<2k', label: 'unter 2.000 € ' },
            { value: '2-4k', label: '2.000–4.000 € ' },
            { value: '4-7k', label: '4.000–7.000 € ' },
            { value: '>7k', label: 'über 7.000 € ' },
            { value: 'unsure', label: 'Weiß ich nicht' }
          ]
        },
        {
          label: 'Zeitrahmen',
          formKey: 'timeframe',
          layout: 'list',
          options: [
            { value: 'fast', label: 'So schnell wie möglich', hint: 'Dringendes Projekt' },
            { value: 'normal', label: 'Normal (4–8 Wochen)', hint: 'Standard-Zeitrahmen' },
            { value: 'flex', label: 'Flexibel', hint: 'Kein Zeitdruck' }
          ]
        }
      ]
    },
    {
      title: 'Fast geschafft!',
      subtitle: 'Wie kann ich dich erreichen? Dann bekommst du deine individuelle Empfehlung.',
      icon: '📬',
      type: 'contact',
      formKey: 'contact',
      fields: [
        { label: 'Dein Name', placeholder: 'Vor- und Nachname' },
        { label: 'E-Mail-Adresse', placeholder: 'name@beispiel.de' },
        { label: 'Noch etwas Wichtiges? (Optional)', placeholder: 'Besondere Wünsche, Fragen oder Anmerkungen...' }
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private serviceDataService: ServiceDataService,
    private api: ApiService,
    private toasts: ToastService
  ) {
    this.packages = this.serviceDataService.getServices();

    this.form = this.fb.group({
      projectType: this.fb.control<'one' | 'multi' | 'custom' | null>(null, Validators.required),
      contentAmount: this.fb.control<'very-low' | 'low' | 'medium' | 'high' | null>(null, Validators.required),
      hasDomain: this.fb.control<'yes' | 'no' | 'unsure' | null>(null, Validators.required),
      domainName: this.fb.control<string>(''),
      hosting: this.fb.control<'self' | 'with-me' | 'unsure' | null>(null, Validators.required),
      hostingProvider: this.fb.control<string>(''),
      features: this.fb.group({
        startSection: this.fb.control<boolean>(false),
        about: this.fb.control<boolean>(false),
        services: this.fb.control<boolean>(false),
        gallery: this.fb.control<boolean>(false),
        team: this.fb.control<boolean>(false),
        testimonials: this.fb.control<boolean>(false),
        contactForm: this.fb.control<boolean>(false),
        map: this.fb.control<boolean>(false),
        faq: this.fb.control<boolean>(false),
        pricing: this.fb.control<boolean>(false),
        blog: this.fb.control<boolean>(false),
        booking: this.fb.control<boolean>(false),
        downloads: this.fb.control<boolean>(false),
        newsletter: this.fb.control<boolean>(false),
        multilingual: this.fb.control<boolean>(false),
        socialLinks: this.fb.control<boolean>(false),
      }),
      budget: this.fb.control<'<2k' | '2-4k' | '4-7k' | '>7k' | 'unsure' | null>(null, Validators.required),
      timeframe: this.fb.control<'fast' | 'normal' | 'flex' | null>(null, Validators.required),
      contactName: this.fb.control<string>('', [Validators.required, Validators.minLength(2)]),
      contactEmail: this.fb.control<string>('', [Validators.required, Validators.email]),
      notes: this.fb.control<string>(''),
    });

    this.formValue = toSignal(
      this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
      { initialValue: this.form.getRawValue() }
    );

    this.goToStep(0);
  }

  step = signal(0);
  maxStepReached = signal(0);
  steps = this.questions.map(q => q.title.split('?')[0] + (q.title.includes('?') ? '?' : ''));

  goToStep(i: number) {
    const last = Math.max(this.maxStepReached(), i);
    this.step.set(i);
    this.maxStepReached.set(last);
  }

  next() {
    if (this.step() < this.steps.length - 1) {
      this.step.update(v => v + 1);
      this.maxStepReached.update(v => Math.max(v, this.step()));
    }
  }

  prev() {
    if (this.step() > 0) this.step.update(v => v - 1);
  }

  get featuresGroup() {
    return this.form.get('features')!;
  }

  answers = computed(() => this.formValue());

  handleOptionClick(formKey: string, value: string, resetFields?: string[]) {
    this.form.patchValue({ [formKey]: value });
    if (resetFields) {
      const resetObj: any = {};
      resetFields.forEach(field => (resetObj[field] = ''));
      this.form.patchValue(resetObj);
    }
  }

  setSectionValue(formKey: string, value: string) {
    this.form.patchValue({ [formKey]: value });
  }

  getFieldLabel(question: Question, index: number): string {
    return question.fields?.[index]?.label ?? '';
  }

  getFieldPlaceholder(question: Question, index: number): string {
    return question.fields?.[index]?.placeholder ?? '';
  }

  isStepValid(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0: return !!this.form.get('projectType')?.value;
      case 1: return !!this.form.get('contentAmount')?.value;
      case 2: return !!this.form.get('hasDomain')?.value;
      case 3: return !!this.form.get('hosting')?.value;
      case 4: return true;
      case 5: return !!this.form.get('budget')?.value && !!this.form.get('timeframe')?.value;
      case 6: return !!this.form.get('contactName')?.valid && !!this.form.get('contactEmail')?.valid;
      default: return false;
    }
  }

  recommendation = computed<{
    pkg: ServiceItem | null;
    reasons: string[];
    confidence: 'low' | 'medium' | 'high';
  }>(() => {
    const a = this.answers();

    const wantsShopOrComplex =
      a.features?.booking ||
      a.features?.multilingual === true;

    const manyPages =
      a.projectType === 'multi' ||
      a.contentAmount === 'medium' ||
      a.contentAmount === 'high';

    const minimalContent =
      a.projectType === 'one' ||
      a.contentAmount === 'very-low' ||
      a.contentAmount === 'low';

    let slug: PackageSlug | null = null;
    const reasons: string[] = [];

    if (wantsShopOrComplex) {
      slug = 'individual-website';
      reasons.push('Spezielle Funktionen wie Terminbuchung oder Mehrsprachigkeit benötigt');
    } else if (manyPages) {
      slug = 'standard-website';
      reasons.push('Mehrere Seiten oder mittlere Menge an Inhalten geplant');
    } else if (minimalContent) {
      slug = 'one-pager';
      reasons.push('Wenige Inhalte – eine klare Seite reicht perfekt aus');
    }

    if (a.budget === '<2k' && slug && slug !== 'one-pager') {
      reasons.push('Budget passt gut zum One-Pager - ggf. mit kleinerem Umfang starten');
    }
    if ((a.budget === '4-7k' || a.budget === '>7k') && slug === 'one-pager' && wantsShopOrComplex) {
      slug = 'individual-website';
      reasons.push('Budget ermöglicht individuelle Lösung mit speziellen Features');
    }

    const confidence: 'low' | 'medium' | 'high' =
      wantsShopOrComplex ? 'high' : manyPages ? 'medium' : 'medium';

    const pkg = slug ? this.packages.find(p => p.slug === slug) ?? null : null;
    return { pkg, reasons, confidence };
  });

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
      const firstInvalid = document.querySelector('.form-input.invalid, .form-textarea.invalid') as HTMLElement | null;
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.isSubmitting.set(true);

    const serviceTypeMap: { [key: string]: ServiceType } = {
      'Einfache Website': ServiceType.SIMPLE_WEBSITE,
      'Standard Website': ServiceType.STANDARD_WEBSITE,
      'Individual Website': ServiceType.INDIVIDUAL_WEBSITE,
      'SEO Optimierung': ServiceType.SEO
    };

    const message = `
    Anfrage über den Website-Fragebogen:
    Projekt: ${this.summary.projekt}
    Inhalte: ${this.summary.inhalte}
    Domain: ${this.summary.domain.status}${this.summary.domain.name ? ' (' + this.summary.domain.name + ')' : ''}
    Hosting: ${this.summary.hosting.wunsch}${this.summary.hosting.provider ? ' (' + this.summary.hosting.provider + ')' : ''}
    Funktionen: ${Object.entries(this.summary.funktionen).filter(([_, v]) => v).map(([k, _]) => k).join(', ') || 'Keine'}
    Budget: ${this.summary.budget}
    Zeitrahmen: ${this.summary.zeitrahmen}
    Empfehlung: ${this.summary.empfehlung}
    Begründung: ${this.summary.begruendung.join('; ') || 'Keine'}
    Kontaktname: ${this.summary.kontakt.name}
    Kontaktemail: ${this.summary.kontakt.email}
    Notizen: ${this.summary.kontakt.notizen || 'Keine'}
    Zeitstempel: ${this.summary.timestamp}
    `;

    const contactRequest: CreateContactRequestDto = {
      name: this.summary.kontakt.name,
      email: this.summary.kontakt.email,
      message: message,
      serviceType: serviceTypeMap[this.summary.empfehlung ?? ''] || ServiceType.NOT_SURE,
      prefersCallback: false,
      phoneNumber: undefined
    };

    this.api.createContactRequest(contactRequest)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          console.log('✅ Kontaktanfrage erfolgreich gesendet:', response);
          this.isSubmitted.set(true);
          this.toasts.success('Kontaktanfrage erfolgreich gesendet!', { duration: 5000 });
        },
        error: (error) => {
          console.error('❌ Fehler beim Senden der Kontaktanfrage:', error);
          this.toasts.error('Fehler beim Senden der Kontaktanfrage.', { duration: 5000 });
        }
      });
  }

  // NEU: Zurück zur Startseite
  goToHome() {
    this.router.navigate(['/']);
  }

  // NEU: Formular zurücksetzen
  resetSurvey() {
    this.isSubmitted.set(false);
    this.step.set(0);
    this.maxStepReached.set(0);
    this.form.reset();
  }
}