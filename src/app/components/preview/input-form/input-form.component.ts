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
  private readonly API_URL = 'http://api.xpnda.de/pocketgpt/audio/mockup';
  private readonly API_KEY = 'jg83kf784jf94jdf984';
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

  features: Feature[] = [
    { value: 'contact', label: 'Kontaktformular' },
    { value: 'gallery', label: 'Bildergalerie' },
    { value: 'testimonials', label: 'Kundenbewertungen' },
    { value: 'blog', label: 'Blog/News' },
    { value: 'social', label: 'Social Media Integration' },
    { value: 'maps', label: 'Standort/Karte' },
  ];
  private http = inject(HttpClient);
  private previews = inject(PreviewService);
  
  constructor(public router: Router) { }


  ngOnInit(): void {
    this.initializeForm();
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