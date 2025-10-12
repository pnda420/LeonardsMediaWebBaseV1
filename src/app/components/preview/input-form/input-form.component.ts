import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApiService, PageAiMockupDto } from '../../../api/api.service';

interface WebsiteType {
  value: string;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent implements OnInit {
  form: FormGroup = new FormGroup({
    customerType: new FormControl<string | null>(''),
    projectName: new FormControl<string | null>(''),
    companyName: new FormControl<string | null>(''),
    typeOfWebsite: new FormControl<string | null>(''),
    primaryColor: new FormControl<string>('#2563eb'),
    designStyle: new FormControl<string>('modern'),
    contentInformation: new FormControl<string | null>(''),
    email: new FormControl<string | null>('', [Validators.required, Validators.email])
  });

  loading = false;
  isLoggedIn = false;
  currentUrl: string = '';
  selectedQuality: 'fast' | 'balanced' | 'premium' = 'balanced';
  showQualitySelector = false;

  websiteTypes: WebsiteType[] = [
    { value: 'praesentation', label: 'Präsentation', icon: '🎯', description: 'Portfolio, Firma' },
    { value: 'landing', label: 'Landingpage', icon: '🚀', description: 'Produkt/Dienstleistung' },
    { value: 'event', label: 'Event', icon: '📅', description: 'Veranstaltung' }
  ];

  customerTypes = [
    { value: 'private', label: 'Privat / Verein', icon: '👤' },
    { value: 'business', label: 'Firma / Unternehmen', icon: '🏢' }
  ];

  private apiService = inject(ApiService);
  public authService = inject(AuthService);
  public router = inject(Router);

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn?.() ?? false;
    this.currentUrl = this.router.url.split('?')[0];

    // Validatoren nur ergänzen, wenn eingeloggt (dein ursprüngliches Verhalten)
    if (this.isLoggedIn) {
      this.applyValidatorsAndSubscriptions();
    }
  }

  private applyValidatorsAndSubscriptions(): void {
    this.form.get('customerType')?.setValidators([Validators.required]);
    this.form.get('projectName')?.setValidators([Validators.required]);
    this.form.get('typeOfWebsite')?.setValidators([Validators.required]);
    this.form.get('contentInformation')?.setValidators([
      Validators.required,
      Validators.minLength(30),
      Validators.maxLength(500)
    ]);

    this.form.get('customerType')?.valueChanges.subscribe(value => {
      const companyNameControl = this.form.get('companyName');
      if (value === 'business') {
        companyNameControl?.setValidators([Validators.required]);
      } else {
        companyNameControl?.clearValidators();
      }
      companyNameControl?.updateValueAndValidity();
    });

    this.form.updateValueAndValidity();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getProgressPercentage(): number {
    const requiredFields = ['customerType', 'projectName', 'typeOfWebsite', 'contentInformation', 'email'];
    const customerType = this.form.get('customerType')?.value;
    if (customerType === 'business') requiredFields.push('companyName');

    const filled = requiredFields.filter(field => {
      const control = this.form.get(field);
      return !!(control && control.value && control.valid);
    });
    return (filled.length / requiredFields.length) * 100;
  }

  getCharCount(): number {
    return this.form.get('contentInformation')?.value?.length || 0;
  }

  onReset(): void {
    if (confirm('Alle Eingaben zurücksetzen?')) {
      this.form.reset({
        customerType: '',
        projectName: '',
        companyName: '',
        typeOfWebsite: '',
        primaryColor: '#2563eb',
        designStyle: 'modern',
        contentInformation: '',
        email: ''
      });
    }
  }

  toggleQualitySelector(): void {
    this.showQualitySelector = !this.showQualitySelector;
  }

  selectQuality(quality: 'fast' | 'balanced' | 'premium'): void {
    this.selectedQuality = quality;
    this.showQualitySelector = false;
  }

  async onSubmit(): Promise<void> {
    // Email muss IMMER gültig sein
    if (this.form.get('email')?.invalid) {
      this.form.get('email')?.markAsTouched();
      return;
    }

    // Wenn eingeloggt, gelten deine strengeren Pflichtfelder (weil Validatoren hinzugefügt wurden)
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(key => this.form.get(key)?.markAsTouched());
      // Im Public-Flow sind nur manche Felder Pflicht; damit Public nicht „hängen bleibt“,
      // erlauben wir trotzdem die Submission, wenn nur Email valid ist.
      if (!this.isLoggedIn) {
        // Fällt durch zum Public-Submit unten
      } else {
        return;
      }
    }

    this.loading = true;

    try {
      const currentUser = this.authService.getCurrentUser?.();

      const dto: PageAiMockupDto = {
        form: {
          ...this.form.value,
          userId: this.isLoggedIn ? currentUser?.id ?? null : null,
          userEmail: this.form.get('email')?.value,
          generatedAt: new Date().toISOString()
        }
      };

      const call$ = this.isLoggedIn
        ? this.apiService.generateWebsiteMockup(dto, this.selectedQuality)        // auth route
        : this.apiService.generateWebsiteMockupPublic(dto, this.selectedQuality); // public route

      call$.subscribe({
        next: (response: any) => {
          console.log('✅ Generierung gestartet:', response);
          this.router.navigate(['/generation-loading']);
          this.loading = false;
        },
        error: (err: any) => {
          console.error('[mockup] API call failed:', err);

          let message = 'Ein Fehler ist aufgetreten.';
          if (err.status === 401 && this.isLoggedIn) {
            message = 'Sitzung abgelaufen. Bitte erneut anmelden.';
            this.authService.logout?.();
          } else if (err.error?.message) {
            message = err.error.message;
          }

          alert(message);
          this.loading = false;
        }
      });

    } catch (err: any) {
      console.error('[mockup] Unexpected error:', err);
      alert('Ein unerwarteter Fehler ist aufgetreten.');
      this.loading = false;
    }
  }
}
