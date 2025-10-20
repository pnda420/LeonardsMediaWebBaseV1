import { Component, Signal, computed, signal } from '@angular/core';
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
  type: 'single-choice' | 'multiple-choice' | 'text' | 'contact';
  formKey: string;
  layout?: 'cards' | 'list';
  options?: QuestionOption[];
  placeholder?: string;
  optional?: boolean;
  fields?: Array<{
    key: string;
    label: string;
    placeholder: string;
    type?: string;
    required?: boolean;
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

  isSubmitted = signal(false);
  isSubmitting = signal(false);

  questions: Question[] = [
    {
      title: 'Was willst du mit deiner Website erreichen?',
      subtitle: 'Wähle, was am besten passt',
      icon: '🎯',
      type: 'single-choice',
      formKey: 'goal',
      layout: 'cards',
      options: [
        {
          value: 'present',
          icon: '👋',
          label: 'Online sichtbar sein',
          hint: 'Ich will gefunden werden und seriös wirken'
        },
        {
          value: 'leads',
          icon: '📞',
          label: 'Kunden gewinnen',
          hint: 'Anfragen und Buchungen generieren'
        },
        {
          value: 'inform',
          icon: '📰',
          label: 'Informieren',
          hint: 'News, Blog oder Wissen teilen'
        }
      ]
    },
    {
      title: 'Gibt es Websites, die dir gefallen?',
      subtitle: 'Zeig mir Beispiele, die deinen Geschmack treffen (optional)',
      icon: '✨',
      type: 'text',
      formKey: 'inspiration',
      placeholder: 'z.B. www.example.com - oder beschreibe den Stil',
      optional: true
    },
    {
      title: 'Wer soll deine Website besuchen?',
      subtitle: 'Das hilft mir, den richtigen Ton zu treffen',
      icon: '👥',
      type: 'single-choice',
      formKey: 'visitors',
      layout: 'cards',
      options: [
        {
          value: 'b2c',
          icon: '👤',
          label: 'Privatpersonen',
          hint: 'Endkunden, die ein Problem lösen wollen'
        },
        {
          value: 'b2b',
          icon: '🏢',
          label: 'Unternehmen',
          hint: 'Andere Firmen sind meine Kunden'
        },
        {
          value: 'both',
          icon: '🤝',
          label: 'Beides',
          hint: 'Sowohl Privat- als auch Geschäftskunden'
        }
      ]
    },
    {
      title: 'Brauchst du etwas Besonderes?',
      subtitle: 'Nur auswählen, wenn du sicher bist, dass du es brauchst',
      icon: '⚡',
      type: 'multiple-choice',
      formKey: 'special',
      options: [
        { value: 'booking', label: 'Online-Terminbuchung' },
        { value: 'shop', label: 'Online-Shop' },
        { value: 'languages', label: 'Mehrere Sprachen' },
        { value: 'blog', label: 'Blog / News-Bereich' },
        { value: 'none', label: 'Nein, nichts Besonderes' }
      ]
    },
    {
      title: 'Wann brauchst du die Website?',
      subtitle: 'Hilft mir bei der Planung',
      icon: '📅',
      type: 'single-choice',
      formKey: 'timeline',
      layout: 'list',
      options: [
        {
          value: 'asap',
          label: 'So schnell wie möglich',
          hint: 'Ich brauche das dringend'
        },
        {
          value: 'normal',
          label: 'In 4-8 Wochen',
          hint: 'Normaler Zeitrahmen ist okay'
        },
        {
          value: 'flexible',
          label: 'Kein Zeitdruck',
          hint: 'Wir können uns Zeit lassen'
        }
      ]
    },
    {
      title: 'Wie kann ich dich erreichen?',
      subtitle: 'Du bekommst innerhalb von 24h meine Empfehlung und ein unverbindliches Angebot',
      icon: '📬',
      type: 'contact',
      formKey: 'contact',
      fields: [
        { key: 'name', label: 'Dein Name', placeholder: 'Max Mustermann', required: true },
        { key: 'email', label: 'E-Mail', placeholder: 'max@beispiel.de', type: 'email', required: true },
        { key: 'phone', label: 'Telefon (optional)', placeholder: '+49 123 456789', required: false }
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
      goal: this.fb.control<string | null>(null, Validators.required),
      inspiration: this.fb.control<string>(''),
      visitors: this.fb.control<string | null>(null, Validators.required),
      special: this.fb.group({
        booking: this.fb.control<boolean>(false),
        shop: this.fb.control<boolean>(false),
        languages: this.fb.control<boolean>(false),
        blog: this.fb.control<boolean>(false),
        none: this.fb.control<boolean>(false),
      }),
      timeline: this.fb.control<string | null>(null, Validators.required),
      name: this.fb.control<string>('', [Validators.required, Validators.minLength(2)]),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      phone: this.fb.control<string>(''),
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

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get specialGroup() {
    return this.form.get('special')!;
  }

  answers = computed(() => this.formValue());

  handleOptionClick(formKey: string, value: string) {
    this.form.patchValue({ [formKey]: value });
  }

  handleCheckboxChange(parentKey: string, checkboxKey: string, checked: boolean) {
    const group = this.form.get(parentKey) as any;
    if (checkboxKey === 'none' && checked) {
      // Wenn "Nichts Besonderes" gewählt wird, alle anderen deaktivieren
      Object.keys(group.controls).forEach(key => {
        group.patchValue({ [key]: key === 'none' });
      });
    } else if (checked) {
      // Wenn etwas anderes gewählt wird, "Nichts Besonderes" deaktivieren
      group.patchValue({ none: false });
    }
  }

  isStepValid(stepIndex: number): boolean {
    const question = this.questions[stepIndex];

    if (question.optional) return true;

    switch (question.type) {
      case 'single-choice':
        return !!this.form.get(question.formKey)?.value;
      case 'text':
        return question.optional || !!this.form.get(question.formKey)?.value;
      case 'multiple-choice':
        return true; // Checkboxes sind immer optional
      case 'contact':
        return !!this.form.get('name')?.valid && !!this.form.get('email')?.valid;
      default:
        return false;
    }
  }

  recommendation = computed<{
    pkg: ServiceItem | null;
    reasons: string[];
    confidence: 'low' | 'medium' | 'high';
  }>(() => {
    const a = this.answers();

    const hasComplexFeatures =
      a.special?.shop ||
      a.special?.booking ||
      a.special?.languages;

    const needsEcommerce = a.goal === 'sell';
    const needsLeadGen = a.goal === 'leads';
    const isSimplePresence = a.goal === 'present' || a.goal === 'inform';

    let slug: PackageSlug | null = null;
    const reasons: string[] = [];

    if (needsEcommerce || hasComplexFeatures) {
      slug = 'individual-website';
      if (needsEcommerce) reasons.push('Online-Verkauf benötigt Shop-System');
      if (a.special?.booking) reasons.push('Terminbuchung ist eine individuelle Lösung');
      if (a.special?.languages) reasons.push('Mehrsprachigkeit erfordert spezielle Struktur');
    } else if (needsLeadGen || a.special?.blog) {
      slug = 'standard-website';
      if (needsLeadGen) reasons.push('Kundengewinnung funktioniert am besten mit mehreren Seiten');
      if (a.special?.blog) reasons.push('Blog-System ist in der Standard-Website enthalten');
    } else if (isSimplePresence) {
      slug = 'one-pager';
      reasons.push('Für Online-Präsenz reicht eine klare, fokussierte Seite perfekt aus');
    }

    const confidence: 'low' | 'medium' | 'high' =
      needsEcommerce || hasComplexFeatures ? 'high' : needsLeadGen ? 'medium' : 'medium';

    const pkg = slug ? this.packages.find(p => p.slug === slug) ?? null : null;
    return { pkg, reasons, confidence };
  });

  get summary() {
    const a = this.answers();
    const rec = this.recommendation();
    return {
      ziel: a.goal,
      inspiration: (a.inspiration || '').trim() || null,
      zielgruppe: a.visitors,
      spezial: a.special,
      zeitrahmen: a.timeline,
      kontakt: {
        name: a.name,
        email: a.email,
        telefon: (a.phone || '').trim() || null,
      },
      empfehlung: rec.pkg?.slug ?? null,
      begruendung: rec.reasons,
      sicherheit: rec.confidence,
      timestamp: new Date().toISOString(),
    };
  }

  submit() {
    if (this.form.invalid) {
      const firstInvalid = document.querySelector('.input.invalid, .textarea.invalid') as HTMLElement | null;
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.isSubmitting.set(true);

    const serviceTypeMap: { [key: string]: ServiceType } = {
      'one-pager': ServiceType.SIMPLE_WEBSITE,
      'standard-website': ServiceType.STANDARD_WEBSITE,
      'individual-website': ServiceType.INDIVIDUAL_WEBSITE,
    };

    const specialFeatures = Object.entries(this.summary.spezial || {})
      .filter(([_, v]) => v)
      .map(([k, _]) => k)
      .join(', ') || 'Keine';

    // Lesbare Labels für die Antworten
    const goalLabels: { [key: string]: string } = {
      'present': 'Online sichtbar sein',
      'leads': 'Kunden gewinnen',
      'inform': 'Informieren (Blog/News)'
    };

    const visitorLabels: { [key: string]: string } = {
      'b2c': 'Privatpersonen',
      'b2b': 'Unternehmen',
      'both': 'B2B + B2C'
    };

    const timelineLabels: { [key: string]: string } = {
      'asap': 'So schnell wie möglich',
      'normal': 'In 4-8 Wochen',
      'flexible': 'Kein Zeitdruck'
    };

    const featureLabels: { [key: string]: string } = {
      'booking': 'Online-Terminbuchung',
      'shop': 'Online-Shop',
      'languages': 'Mehrsprachigkeit',
      'blog': 'Blog/News-Bereich',
      'none': 'Nichts Besonderes'
    };

    const selectedFeatures = Object.entries(this.summary.spezial || {})
      .filter(([_, v]) => v)
      .map(([k, _]) => featureLabels[k] || k)
      .join(', ') || 'Keine besonderen Features';

    const packageLabels: { [key: string]: string } = {
      'one-pager': '📄 One-Pager (Einfache Website)',
      'standard-website': '📑 Standard Website',
      'individual-website': '⚙️ Individual Website'
    };

    const message = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NEUE WEBSITE-ANFRAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 KONTAKT
   Name:     ${this.summary.kontakt.name}
   E-Mail:   ${this.summary.kontakt.email}
   Telefon:  ${this.summary.kontakt.telefon || '—'}

🎯 PROJEKT-DETAILS
   Hauptziel:     ${goalLabels[this.summary.ziel] || this.summary.ziel}
   Zielgruppe:    ${visitorLabels[this.summary.zielgruppe] || this.summary.zielgruppe}
   Features:      ${selectedFeatures}
   Zeitrahmen:    ${timelineLabels[this.summary.zeitrahmen] || this.summary.zeitrahmen}

${this.summary.inspiration ? `💡 INSPIRATION\n   ${this.summary.inspiration}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AUTOMATISCHE EMPFEHLUNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Empfohlenes Paket: ${packageLabels[this.summary.empfehlung || ''] || 'Noch nicht festgelegt'}

${this.summary.begruendung.length > 0 ? `Begründung:\n${this.summary.begruendung.map(r => `   • ${r}`).join('\n')}` : ''}

Konfidenz: ${this.summary.sicherheit === 'high' ? '⭐⭐⭐ Sehr sicher' : this.summary.sicherheit === 'medium' ? '⭐⭐ Ziemlich sicher' : '⭐ Unsicher'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Eingegangen am: ${new Date(this.summary.timestamp).toLocaleString('de-DE')}
    `.trim();

    const contactRequest: CreateContactRequestDto = {
      name: this.summary.kontakt.name,
      email: this.summary.kontakt.email,
      message: message,
      serviceType: serviceTypeMap[this.summary.empfehlung ?? ''] || ServiceType.NOT_SURE,
      prefersCallback: !!this.summary.kontakt.telefon,
      phoneNumber: this.summary.kontakt.telefon || undefined
    };

    this.api.createContactRequest(contactRequest)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          this.scrollToTop();
          this.isSubmitted.set(true);
          this.toasts.success('Kontaktanfrage erfolgreich gesendet!', { duration: 5000 });
        },
        error: (error) => {
          console.error('❌ Fehler beim Senden der Kontaktanfrage:', error);
          this.toasts.error('Fehler beim Senden der Kontaktanfrage.', { duration: 5000 });
        }
      });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  resetSurvey() {
    this.isSubmitted.set(false);
    this.step.set(0);
    this.maxStepReached.set(0);
    this.form.reset();
  }
}