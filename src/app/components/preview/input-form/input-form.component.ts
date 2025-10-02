import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PreviewService } from '../../../state/preview.service';
import { Router } from '@angular/router';

interface MockupResponse {
  ok: boolean;
  html: string;
  css: string;
  rawLength: number;
}

interface WebsiteType {
  value: string;
  label: string;
  icon: string;
  description: string;
}

interface Feature {
  value: string;
  label: string;
}

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss'
})
export class InputFormComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  selectedFeatures: Set<string> = new Set();

  // Configuration
  private readonly API_URL = 'http://api.xpnda.de/pocketgpt/audio/mockup';
  private readonly API_KEY = 'jg83kf784jf94jdf984';

  // Website Types
  websiteTypes: WebsiteType[] = [
    {
      value: 'praesentation',
      label: 'Präsentation',
      icon: '🎯',
      description: 'Portfolio, Firma, Künstler'
    },
    {
      value: 'verkauf',
      label: 'Verkauf',
      icon: '🛒',
      description: 'Shop, Produkt, SaaS'
    },
    {
      value: 'landing',
      label: 'Landing Page',
      icon: '🚀',
      description: 'Anmeldung, Coming Soon'
    },
    {
      value: 'event',
      label: 'Event/Info',
      icon: '📅',
      description: 'Veranstaltung, Restaurant'
    },
    {
      value: 'wissen',
      label: 'Service',
      icon: '📚',
      description: 'FAQ, Dokumentation'
    }
  ];

  // Features
  features: Feature[] = [
    { value: 'contact', label: 'Kontaktformular' },
    { value: 'gallery', label: 'Bildergalerie' },
    { value: 'testimonials', label: 'Kundenbewertungen' },
    { value: 'blog', label: 'Blog/News' },
    { value: 'social', label: 'Social Media Integration' },
    { value: 'maps', label: 'Standort/Karte' },

  ];


  fakeResponse = {
    ok: true,
    html: "<style>\n:root{\n  --primary: #2563eb;\n  --secondary: #64748b;\n  --accent: #f59e0b;\n  --bg: #f8fafc;\n  --card: #ffffff;\n  --muted: #6b7280;\n  --radius: 12px;\n  --glass: rgba(255,255,255,0.6);\n  font-family: Inter, ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial;\n  color-scheme: light;\n}\n*{box-sizing:border-box}\nhtml,body{height:100%;margin:0;background:linear-gradient(180deg, var(--bg), #f1f5f9);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}\nheader{\n  padding:18px 20px;\n  display:flex;\n  align-items:center;\n  justify-content:space-between;\n  gap:16px;\n  position:sticky;\n  top:0;\n  background:linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.5));\n  backdrop-filter: blur(6px);\n  border-bottom:1px solid rgba(15,23,42,0.04);\n  z-index:10;\n}\n.brand{\n  display:flex;\n  align-items:center;\n  gap:14px;\n  text-decoration:none;\n}\n.logo{\n  width:56px;\n  height:56px;\n  border-radius:10px;\n  overflow:hidden;\n  flex-shrink:0;\n  box-shadow: 0 6px 18px rgba(37,99,235,0.12), inset 0 -6px 18px rgba(100,116,139,0.03);\n  border:1px solid rgba(15,23,42,0.04);\n}\n.logo img{width:100%;height:100%;object-fit:cover;display:block}\n.brand-text{\n  display:flex;\n  flex-direction:column;\n  line-height:1;\n}\n.brand-text .title{\n  font-weight:700;\n  color:var(--primary);\n  font-size:16px;\n}\n.brand-text .subtitle{\n  font-size:12px;\n  color:var(--secondary);\n  margin-top:2px;\n}\n.nav{\n  display:flex;\n  align-items:center;\n  gap:10px;\n}\n.cta{\n  background:linear-gradient(90deg, var(--primary), #1e40af);\n  color:#fff;\n  border:none;\n  padding:10px 14px;\n  border-radius:10px;\n  font-weight:600;\n  box-shadow: 0 8px 24px rgba(37,99,235,0.18);\n  text-decoration:none;\n  display:inline-flex;\n  gap:10px;\n  align-items:center;\n}\n.ghost{\n  background:transparent;\n  color:var(--secondary);\n  padding:8px 12px;\n  border-radius:10px;\n  text-decoration:none;\n  border:1px solid rgba(100,116,139,0.08);\n  font-weight:600;\n}\n.container{\n  max-width:1100px;\n  margin:28px auto;\n  padding:0 20px;\n}\n.hero{\n  display:grid;\n  grid-template-columns: 1fr 420px;\n  gap:24px;\n  align-items:center;\n  margin-bottom:28px;\n}\n@media (max-width:880px){\n  .hero{grid-template-columns:1fr; padding-top:6px}\n  .logo{width:48px;height:48px}\n}\n.card{\n  background:var(--card);\n  border-radius:var(--radius);\n  padding:20px;\n  box-shadow: 0 10px 30px rgba(2,6,23,0.06);\n  border:1px solid rgba(15,23,42,0.04);\n}\n.intro h1{\n  margin:0;\n  font-size:28px;\n  color:#0f172a;\n  line-height:1.05;\n}\n.lead{\n  margin-top:10px;\n  color:var(--muted);\n  font-size:15px;\n}\n.meta{\n  display:flex;\n  gap:12px;\n  margin-top:16px;\n  flex-wrap:wrap;\n}\n.meta .pill{\n  background:linear-gradient(180deg, rgba(100,116,139,0.06), rgba(100,116,139,0.03));\n  color:var(--secondary);\n  padding:8px 12px;\n  border-radius:999px;\n  font-weight:600;\n  font-size:13px;\n  border:1px solid rgba(100,116,139,0.06);\n}\n.preview{\n  display:flex;\n  flex-direction:column;\n  gap:12px;\n}\n.preview .image{\n  border-radius:12px;\n  overflow:hidden;\n  height:260px;\n  background:linear-gradient(180deg, rgba(37,99,235,0.06), rgba(100,116,139,0.03));\n  display:block;\n}\n.preview .image img{width:100%;height:100%;object-fit:cover;display:block}\n.info-grid{\n  display:grid;\n  grid-template-columns:repeat(3,1fr);\n  gap:12px;\n  margin-top:16px;\n}\n@media (max-width:720px){\n  .info-grid{grid-template-columns:repeat(1,1fr)}\n}\n.info{\n  padding:12px;\n  border-radius:10px;\n  background:linear-gradient(180deg, rgba(250,250,250,0.9), rgba(255,255,255,0.9));\n  border:1px solid rgba(15,23,42,0.03);\n}\n.info h3{margin:0;font-size:13px;color:var(--secondary);font-weight:700}\n.info p{margin:8px 0 0;color:var(--muted);font-size:14px}\n.section{\n  margin-top:22px;\n  display:grid;\n  grid-template-columns: 1fr 320px;\n  gap:20px;\n}\n@media (max-width:980px){\n  .section{grid-template-columns:1fr}\n}\n.panel{\n  display:flex;\n  flex-direction:column;\n  gap:12px;\n}\n.features-list{\n  display:grid;\n  gap:10px;\n}\n.feature{\n  display:flex;\n  gap:12px;\n  padding:12px;\n  border-radius:10px;\n  align-items:flex-start;\n  background:linear-gradient(180deg, rgba(250,250,250,0.9), rgba(255,255,255,0.9));\n  border:1px solid rgba(15,23,42,0.03);\n}\n.feature .icon{\n  width:44px;height:44px;border-radius:8px;background:linear-gradient(180deg,var(--accent), #f7b955);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;flex-shrink:0;box-shadow:0 6px 18px rgba(245,158,11,0.14)\n}\n.feature h4{margin:0;font-size:15px;color:#0f172a}\n.feature p{margin:6px 0 0;color:var(--muted);font-size:13px}\n.contact-card{\n  position:sticky;\n  top:88px;\n  padding:16px;\n}\n.contact-card .row{display:flex;align-items:center;justify-content:space-between;gap:10px}\n.contact-item{\n  display:flex;flex-direction:column;gap:6px;padding:12px;border-radius:10px;background:linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9));border:1px solid rgba(15,23,42,0.03)\n}\n.contact-item strong{color:var(--primary);font-size:14px}\n.footer{\n  margin-top:36px;\n  padding:28px 20px;\n  background:transparent;\n  display:flex;\n  gap:18px;\n  justify-content:space-between;\n  align-items:center;\n  flex-wrap:wrap;\n  color:var(--secondary);\n  font-size:14px;\n}\n.small{\n  font-size:13px;color:var(--muted)\n}\n.kv{\n  display:flex;gap:12px;align-items:center;\n}\n.badge{\n  background:linear-gradient(90deg,var(--primary), #1e40af);\n  color:white;padding:8px 12px;border-radius:999px;font-weight:700;font-size:13px;\n  box-shadow:0 8px 20px rgba(37,99,235,0.12)\n}\n.footer a{color:var(--secondary);text-decoration:none;padding:8px;border-radius:8px}\n.fake-map{\n  height:160px;border-radius:10px;overflow:hidden;background:url(\"https://picsum.photos/800/400?random=12\") center/cover no-repeat;border:1px solid rgba(15,23,42,0.04)\n}\n.divider{height:1px;background:linear-gradient(90deg, transparent, rgba(15,23,42,0.04), transparent);margin:18px 0;border-radius:2px}\n.note{font-size:13px;color:var(--muted)}\n/* utility */\n.flex{display:flex;align-items:center;gap:12px}\n.stack{display:flex;flex-direction:column;gap:6px}\n.center{text-align:center}\n</style>\n\n<header>\n  <a class=\"brand\" href=\"#\">\n    <div class=\"logo\">\n      <img src=\"https://picsum.photos/seed/logoTom/400/400\" alt=\"Logo Tom Leonards\">\n    </div>\n    <div class=\"brand-text\">\n      <span class=\"title\">Tom Leonards</span>\n      <span class=\"subtitle\">Club · Präsentation</span>\n    </div>\n  </a>\n\n  <nav class=\"nav\" aria-label=\"Hauptnavigation\">\n    <a class=\"ghost\" href=\"#\">Übersicht</a>\n    <a class=\"ghost\" href=\"#\">Features</a>\n    <a class=\"ghost\" href=\"#\">Kontakt</a>\n    <a class=\"cta\" href=\"#\">Anfrage</a>\n  </nav>\n</header>\n\n<main>\n  <div class=\"container\">\n    <section class=\"hero\">\n      <div class=\"card intro\">\n        <h1>Willkommen — Tom Leonards</h1>\n        <p class=\"lead\">Professionelles, freundliches Club-Profil zum Präsentieren Ihrer Aktivitäten, Ansprechpartner und visuellen Inhalte. Cleanes Layout, mobil optimiert.</p>\n\n        <div class=\"meta\">\n          <span class=\"pill\">Rolle: club</span>\n          <span class=\"pill\">Sprache: Deutsch</span>\n          <span class=\"pill\">Typ: Präsentation</span>\n        </div>\n\n        <div class=\"divider\"></div>\n\n        <div class=\"info-grid\">\n          <div class=\"info\">\n            <h3>Kontakt</h3>\n            <p>E-Mail: tom.leonards2003@gmail.com</p>\n            <p>Telefon: +49 175 8905050</p>\n          </div>\n          <div class=\"info\">\n            <h3>Zielpublikum</h3>\n            <p>sdfsdfdsfsfsfsdf</p>\n          </div>\n          <div class=\"info\">\n            <h3>Projektinfo</h3>\n            <p>dsffsdfdsfsdfsfsdffsdf</p>\n          </div>\n        </div>\n\n        <div class=\"section\">\n          <div class=\"panel\">\n            <div class=\"card\">\n              <h3 style=\"margin:0 0 8px 0;\">Kurzbeschreibung</h3>\n              <p class=\"note\">Dieses Mockup zeigt eine professionelle Präsentationsseite für einen Club. Alle Elemente sind nicht-funktional und dienen ausschließlich der Visualisierung.</p>\n            </div>\n\n            <div class=\"card\">\n              <h3 style=\"margin:0 0 8px 0;\">Designstil</h3>\n              <p class=\"note\">Friendly · Modern · Clean · Sehr responsiv</p>\n            </div>\n\n            <div id=\"features\" class=\"card features-list\">\n              <div class=\"feature\">\n                <div class=\"icon\">A</div>\n                <div>\n                  <h4>Visuelles Profil</h4>\n                  <p>Präsentation von Bildern, Logo und Kerninformationen auf einen Blick.</p>\n                </div>\n              </div>\n\n              <div class=\"feature\">\n                <div class=\"icon\">B</div>\n                <div>\n                  <h4>Kontaktübersicht</h4>\n                  <p>Wichtige Ansprechpartner und Kontaktkanäle prominent platziert.</p>\n                </div>\n              </div>\n\n              <div class=\"feature\">\n                <div class=\"icon\">C</div>\n                <div>\n                  <h4>Responsives Layout</h4>\n                  <p>Mobil-first Gestaltung für beste Lesbarkeit auf kleinen Bildschirmen.</p>\n                </div>\n              </div>\n            </div>\n\n          </div>\n\n          <aside class=\"contact-card card\">\n            <div class=\"stack\">\n              <div class=\"kv\">\n                <div>\n                  <div class=\"badge\">Club</div>\n                </div>\n                <div class=\"small\">Kontakt & Details</div>\n              </div>\n\n              <div class=\"contact-item\">\n                <strong>Tom Leonards</strong>\n                <span class=\"note\">Ansprechpartner</span>\n              </div>\n\n              <div class=\"contact-item\">\n                <strong>Email</strong>\n                <span class=\"note\">tom.leonards2003@gmail.com</span>\n              </div>\n\n              <div class=\"contact-item\">\n                <strong>Telefon</strong>\n                <span class=\"note\">+49 175 8905050</span>\n              </div>\n\n              <div class=\"divider\"></div>\n\n              <div class=\"note\">Hinweis: Dieses Mockup ist rein statisch — Buttons und Links sind nicht funktional.</div>\n            </div>\n          </aside>\n        </div>\n      </div>\n\n      <div class=\"preview\">\n        <div class=\"card\">\n          <div class=\"fake-map\" aria-hidden=\"true\"></div>\n          <div style=\"margin-top:12px;display:flex;gap:10px;\">\n            <a class=\"ghost\" href=\"#\">Galerie</a>\n            <a class=\"cta\" href=\"#\">Mehr Infos</a>\n          </div>\n        </div>\n\n        <div class=\"card\">\n          <h3 style=\"margin:0 0 8px 0;\">Visuelle Vorschau</h3>\n          <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:8px\">\n            <img src=\"https://picsum.photos/seed/pic1/400/240\" alt=\"Vorschau 1\" style=\"width:100%;height:96px;object-fit:cover;border-radius:8px\">\n            <img src=\"https://picsum.photos/seed/pic2/400/240\" alt=\"Vorschau 2\" style=\"width:100%;height:96px;object-fit:cover;border-radius:8px\">\n            <img src=\"https://picsum.photos/seed/pic3/400/240\" alt=\"Vorschau 3\" style=\"width:100%;height:96px;object-fit:cover;border-radius:8px\">\n            <img src=\"https://picsum.photos/seed/pic4/400/240\" alt=\"Vorschau 4\" style=\"width:100%;height:96px;object-fit:cover;border-radius:8px\">\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"card\" style=\"margin-top:18px;\">\n      <h3 style=\"margin:0 0 10px 0;\">Weitere Informationen</h3>\n      <p class=\"note\">Generiert am: 2025-10-02 · Version 2.0</p>\n      <div style=\"margin-top:12px;display:flex;flex-wrap:wrap;gap:10px\">\n        <a class=\"ghost\" href=\"#\">AGB</a>\n        <a class=\"ghost\" href=\"#\">Datenschutz</a>\n        <a class=\"ghost\" href=\"#\">Impressum</a>\n      </div>\n    </section>\n\n    <footer class=\"footer\">\n      <div class=\"kv\">\n        <div class=\"brand-text\">\n          <span class=\"title\">Tom Leonards</span>\n          <span class=\"subtitle\">Club · Präsentation</span>\n        </div>\n      </div>\n\n      <div class=\"small center\">Kontakt: tom.leonards2003@gmail.com · +49 175 8905050</div>\n\n      <div class=\"kv\">\n        <span class=\"small\">Erstellt: 2025</span>\n        <a href=\"#\" class=\"ghost\">Nach oben</a>\n      </div>\n    </footer>\n  </div>\n</main>",
    rawLength: 12272
};

  private http = inject(HttpClient);
  private previews = inject(PreviewService);


  constructor(public router: Router) { }

  ngOnInit(): void {
    this.initializeForm();

    const res = this.removeBackSlashN(this.fakeResponse.html);

    //set fake data in state

    console.log(res);
    this.previews.add({
      html: res,
      form: " "
    });
  }

  private removeBackSlashN(str: string): string {
    return str.replace(/\\n/g, '');
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      // Kontakt
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),

      // Projekt/Infos (AN TEMPLATE ANGEPASST)
      projectName: new FormControl(''),
      role: new FormControl('', [Validators.required]),
      useImage: new FormControl(false),
      projectImage: new FormControl(''), // nur URL

      // Design
      primaryColor: new FormControl('#2563eb', [Validators.required]),
      secondaryColor: new FormControl('#64748b', [Validators.required]),
      accentColor: new FormControl('#f59e0b'),
      designStyle: new FormControl('', [Validators.required]),

      // Inhalte
      typeOfWebsite: new FormControl('', [Validators.required]),
      targetAudience: new FormControl('', [Validators.required]),
      language: new FormControl('de'),
      features: new FormControl([]),
      contentInformation: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(1000)
      ]),
    });
  }

  // Helper Methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getProgressPercentage(): number {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'companyName',
      'industry', 'primaryColor', 'secondaryColor',
      'designStyle', 'typeOfWebsite', 'targetAudience',
      'contentInformation'
    ];

    const filledFields = requiredFields.filter(field => {
      const control = this.form.get(field);
      return control && control.value && control.valid;
    });

    return (filledFields.length / requiredFields.length) * 100;
  }

  getCharCount(): number {
    const content = this.form.get('contentInformation')?.value || '';
    return content.length;
  }

  onFeatureChange(event: Event, feature: string): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.selectedFeatures.add(feature);
    } else {
      this.selectedFeatures.delete(feature);
    }

    this.form.patchValue({
      features: Array.from(this.selectedFeatures)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // File validation
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Die Datei ist zu groß. Maximal 5MB erlaubt.');
        return;
      }

      // Convert to base64 or upload to server
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          this.form.patchValue({
            companyImage: result.toString()
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onReset(): void {
    if (confirm('Möchten Sie wirklich alle Eingaben zurücksetzen?')) {
      this.form.reset({
        language: 'de',
        timeline: 'asap',
        primaryColor: '#2563eb',
        secondaryColor: '#64748b',
        accentColor: '#f59e0b'
      });
      this.selectedFeatures.clear();
    }
  }

  async onSubmit(): Promise<void> {
    // Mark all fields as touched to show validation errors
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });

      // Scroll to first error
      const firstError = document.querySelector('.error-input');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.loading = true;
    const headers = new HttpHeaders({
      'x-api-key': this.API_KEY,
      'Content-Type': 'application/json'
    });

    try {
      // Prepare form data
      const formData = this.prepareFormData();
      const body = { form: formData };

      console.log('[mockup] Sending request with data:', body);

      const res = await firstValueFrom(
        this.http.post<MockupResponse>(this.API_URL, body, { headers })
      );

      console.log('[mockup] Response received:', res);

      // Save to preview service
      this.previews.add({
        html: res?.html ?? '',
        form: formData,
      });

      

      // Navigate to preview
      await this.router.navigate(['/preview']);

      console.log('[state] Total previews:', this.previews.previews().length);

      // Show success message (optional)
      this.showSuccessMessage();

    } catch (err) {
      const error = err as HttpErrorResponse;
      console.error('[mockup] API call failed:', error);

      // Show user-friendly error message
      this.showErrorMessage(error);

    } finally {
      this.loading = false;
    }
  }

  private prepareFormData(): any {
    const formValue = this.form.value;

    // Add metadata
    return {
      ...formValue,
      generatedAt: new Date().toISOString(),
      version: '2.0',
      features: Array.from(this.selectedFeatures)
    };
  }

  private showSuccessMessage(): void {
    // Implement success notification
    console.log('✓ Website erfolgreich generiert!');
  }

  private showErrorMessage(error: HttpErrorResponse): void {
    let message = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';

    if (error.status === 0) {
      message = 'Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung.';
    } else if (error.status === 401) {
      message = 'Authentifizierung fehlgeschlagen. Bitte kontaktieren Sie den Support.';
    } else if (error.status === 429) {
      message = 'Zu viele Anfragen. Bitte warten Sie einen Moment.';
    } else if (error.status >= 500) {
      message = 'Serverfehler. Bitte versuchen Sie es später erneut.';
    }

    alert(message); // Replace with proper notification system
    console.error('[error]', message, error);
  }
}