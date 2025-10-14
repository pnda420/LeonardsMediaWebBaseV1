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
      subtitle: 'Keine Sorge - wir helfen dir, die richtige Lösung zu finden.',
      icon: '🎯',
      type: 'single-choice',
      formKey: 'projectType',
      layout: 'cards',
      options: [
        {
          value: 'one',
          label: 'Eine einfache Seite',
          hint: 'Alles auf einen Blick - perfekt für schnelle Online-Präsenz',
          icon: '📄'
        },
        {
          value: 'multi',
          label: 'Mehrere Seiten',
          hint: 'Klassische Website mit Start, Leistungen, Kontakt usw.',
          icon: '📑'
        },
        {
          value: 'custom',
          label: 'Etwas Individuelles',
          hint: 'Spezielle Features wie Buchungssystem, Shop oder Datenbank',
          icon: '⚙️'
        }
      ]
    },
    {
      title: 'Wie viel Inhalt ist geplant?',
      subtitle: 'Eine grobe Einschätzung reicht - wir passen das später gemeinsam an.',
      icon: '📊',
      type: 'single-choice',
      formKey: 'contentAmount',
      layout: 'list',
      options: [
        {
          value: 'very-low',
          label: 'Sehr wenig',
          hint: 'Zum Beispiel: Startseite mit Kontaktdaten und kurzer Beschreibung'
        },
        {
          value: 'low',
          label: 'Wenig',
          hint: 'Zum Beispiel: Start, Über uns, Leistungen, Kontakt (3-5 Bereiche)'
        },
        {
          value: 'medium',
          label: 'Mittel',
          hint: 'Zum Beispiel: + Portfolio, Team, FAQ, Referenzen (6-10 Bereiche)'
        },
        {
          value: 'high',
          label: 'Viel',
          hint: 'Mehr als 10 Bereiche, z.B. mit Blog, vielen Unterseiten oder Produkten'
        }
      ]
    },
    {
      title: 'Hast du bereits eine Domain?',
      subtitle: 'Eine Domain ist deine Website-Adresse (z.B. meinefirma.de). Falls nicht - wir kümmern uns darum.',
      icon: '🌐',
      type: 'single-choice',
      formKey: 'hasDomain',
      layout: 'list',
      options: [
        {
          value: 'yes',
          label: 'Ja, habe ich bereits',
          hint: 'Perfekt - wir verbinden sie mit deiner neuen Website'
        },
        {
          value: 'no',
          label: 'Nein, brauche ich noch',
          hint: 'Kein Problem - wir helfen dir bei der Auswahl und Registrierung'
        },
        {
          value: 'unsure',
          label: 'Bin mir nicht sicher',
          hint: 'Wir klären das gemeinsam im Gespräch'
        }
      ],
      resetFields: ['domainName'],
      conditionalInput: {
        showWhen: 'yes',
        formKey: 'domainName',
        label: 'Wie lautet deine Domain? (Optional - hilft uns bei der Vorbereitung)',
        placeholder: 'z.B. meinefirma.de'
      }
    },
    {
      title: 'Wo soll die Website gehostet werden?',
      subtitle: 'Hosting = wo deine Website technisch liegt. Wir kümmern uns komplett darum, falls gewünscht.',
      icon: '☁️',
      type: 'single-choice',
      formKey: 'hosting',
      layout: 'list',
      options: [
        {
          value: 'with-me',
          label: 'Bitte komplett bei euch hosten',
          hint: 'Wir kümmern uns um alles - du musst dich um nichts Technisches kümmern'
        },
        {
          value: 'self',
          label: 'Ich habe bereits Hosting',
          hint: 'Du hast schon einen Anbieter - wir richten die Website dort ein'
        },
        {
          value: 'unsure',
          label: 'Weiß ich noch nicht',
          hint: 'Wir beraten dich gerne - je nach Projekt gibt es unterschiedliche Optionen'
        }
      ],
      resetFields: ['hostingProvider'],
      conditionalInput: {
        showWhen: 'self',
        formKey: 'hostingProvider',
        label: 'Bei welchem Anbieter hostest du? (Optional - hilft uns bei der Einschätzung)',
        placeholder: 'z.B. IONOS, Strato, all-inkl, netcup'
      }
    },
    {
      title: 'Welche Funktionen brauchst du?',
      subtitle: 'Wähle alle Bereiche aus, die auf deiner Website sein sollen. Mehrfachauswahl möglich.',
      icon: '✨',
      type: 'multiple-choice',
      formKey: 'features',
      options: [
        {
          value: 'startSection',
          label: 'Startbereich mit großem Bild',
          hint: 'Hero-Bereich - das erste, was Besucher sehen'
        },
        {
          value: 'about',
          label: 'Über mich / Über uns',
          hint: 'Vorstellung von dir, deinem Team oder deinem Unternehmen'
        },
        {
          value: 'services',
          label: 'Leistungen / Angebote',
          hint: 'Was du anbietest - Dienstleistungen oder Produkte'
        },
        {
          value: 'gallery',
          label: 'Bildergalerie / Portfolio',
          hint: 'Zeige deine Arbeiten, Projekte oder Referenzen mit Bildern'
        },
        {
          value: 'team',
          label: 'Teamvorstellung',
          hint: 'Stelle deine Mitarbeiter mit Fotos und Infos vor'
        },
        {
          value: 'testimonials',
          label: 'Kundenstimmen / Bewertungen',
          hint: 'Zeige, was deine Kunden über dich sagen'
        },
        {
          value: 'contactForm',
          label: 'Kontaktformular',
          hint: 'Besucher können dir direkt Nachrichten schicken'
        },
        {
          value: 'map',
          label: 'Standortkarte (Google Maps)',
          hint: 'Zeige, wo du zu finden bist - mit interaktiver Karte'
        },
        {
          value: 'faq',
          label: 'FAQ / Häufige Fragen',
          hint: 'Beantworte die wichtigsten Fragen deiner Kunden vorab'
        },
        {
          value: 'pricing',
          label: 'Preise / Pakete',
          hint: 'Zeige deine Preise transparent - mit oder ohne Buchungsmöglichkeit'
        },
        {
          value: 'blog',
          label: 'Blog / News-Bereich',
          hint: 'Regelmäßig Artikel veröffentlichen - gut für Google & Kunden'
        },
        {
          value: 'booking',
          label: 'Online-Terminbuchung',
          hint: 'Kunden können direkt online Termine bei dir buchen'
        },
        {
          value: 'downloads',
          label: 'Download-Bereich',
          hint: 'Stelle PDFs, Broschüren oder Dokumente zum Download bereit'
        },
        {
          value: 'newsletter',
          label: 'Newsletter-Anmeldung',
          hint: 'Sammle E-Mail-Adressen für Marketing & Updates'
        },
        {
          value: 'multilingual',
          label: 'Mehrsprachigkeit',
          hint: 'Website in Deutsch + einer oder mehreren weiteren Sprachen'
        },
        {
          value: 'socialLinks',
          label: 'Social Media Links',
          hint: 'Verlinke zu Instagram, Facebook, LinkedIn usw.'
        }
      ]
    },
    {
      title: 'Budget & Zeitrahmen',
      subtitle: 'Hilft uns, dir ein realistisches und passendes Angebot zu machen. Alles bleibt vertraulich.',
      icon: '💰',
      type: 'combined',
      formKey: 'combined',
      sections: [
        {
          label: 'Was kannst du ungefähr investieren?',
          formKey: 'budget',
          layout: 'grid',
          options: [
            { value: '<2k', label: 'unter 2.000 €' },
            { value: '2-4k', label: '2.000–4.000 €' },
            { value: '4-7k', label: '4.000–7.000 €' },
            { value: '>7k', label: 'über 7.000 €' },
            { value: 'unsure', label: 'Weiß ich noch nicht' }
          ]
        },
        {
          label: 'Wie dringend brauchst du die Website?',
          formKey: 'timeframe',
          layout: 'list',
          options: [
            {
              value: 'fast',
              label: 'So schnell wie möglich',
              hint: 'Dringendes Projekt - wir priorisieren es entsprechend'
            },
            {
              value: 'normal',
              label: 'Normal (4–8 Wochen)',
              hint: 'Standard-Zeitrahmen für die meisten Projekte'
            },
            {
              value: 'flex',
              label: 'Kein Zeitdruck',
              hint: 'Flexibel planbar - wir finden gemeinsam den besten Zeitpunkt'
            }
          ]
        }
      ]
    },
    {
      title: 'Fast geschafft!',
      subtitle: 'Wie können wir dich erreichen? Du bekommst dann deine persönliche Empfehlung von uns.',
      icon: '📬',
      type: 'contact',
      formKey: 'contact',
      fields: [
        { label: 'Dein Name', placeholder: 'Vor- und Nachname' },
        { label: 'Deine E-Mail-Adresse', placeholder: 'name@beispiel.de' },
        {
          label: 'Noch etwas, das wir wissen sollten? (Optional)',
          placeholder: 'Besondere Wünsche, Fragen, Deadline, Design-Vorstellungen...'
        }
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
      this.scrollToSurvey();
    }
  }

  prev() {
    if (this.step() > 0) this.step.update(v => v - 1);
    this.scrollToSurvey();
  }

  scrollToSurvey() {
    const element = document.getElementById('survey');
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
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