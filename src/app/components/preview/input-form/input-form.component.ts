import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PreviewService } from '../../../state/preview.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface MockupResponse {
  ok: boolean;
  html: string;
  css: string;
}

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
  styleUrl: './input-form.component.scss'
})
export class InputFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isLoggedIn = false;
  currentUrl: string = '';

  private readonly API_URL = 'http://api.xpnda.de/pocketgpt/audio/mockup';
  private readonly API_KEY = 'jg83kf784jf94jdf984';

  websiteTypes: WebsiteType[] = [
    { value: 'praesentation', label: 'Präsentation', icon: '🎯', description: 'Portfolio, Firma', },
    { value: 'landing', label: 'Landingpage', icon: '🚀', description: 'Produkt/Dienstleistung', },
    { value: 'event', label: 'Event', icon: '📅', description: 'Veranstaltung', }
  ];

  customerTypes = [
    { value: 'private', label: 'Privat / Verein', icon: '👤' },
    { value: 'business', label: 'Firma / Unternehmen', icon: '🏢' }
  ];

  private http = inject(HttpClient);
  private previews = inject(PreviewService);
  public authService = inject(AuthService);

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    this.currentUrl = this.router.url.split('?')[0];


    if (this.isLoggedIn) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      customerType: new FormControl('', [Validators.required]),
      projectName: new FormControl('', [Validators.required]),
      companyName: new FormControl(''),
      typeOfWebsite: new FormControl('', [Validators.required]),
      primaryColor: new FormControl('#2563eb'),
      designStyle: new FormControl('modern'),
      contentInformation: new FormControl('', [
        Validators.required,
        Validators.minLength(30),
        Validators.maxLength(500)
      ])
    });

    // Conditional validation for company name
    this.form.get('customerType')?.valueChanges.subscribe(value => {
      const companyNameControl = this.form.get('companyName');
      if (value === 'business') {
        companyNameControl?.setValidators([Validators.required]);
      } else {
        companyNameControl?.clearValidators();
      }
      companyNameControl?.updateValueAndValidity();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getProgressPercentage(): number {
    const requiredFields = ['customerType', 'projectName', 'typeOfWebsite', 'contentInformation'];
    const customerType = this.form.get('customerType')?.value;

    // Add companyName to required fields if business
    if (customerType === 'business') {
      requiredFields.push('companyName');
    }

    const filledFields = requiredFields.filter(field => {
      const control = this.form.get(field);
      return control && control.value && control.valid;
    });
    return (filledFields.length / requiredFields.length) * 100;
  }

  getCharCount(): number {
    return this.form.get('contentInformation')?.value?.length || 0;
  }

  onReset(): void {
    if (confirm('Alle Eingaben zurücksetzen?')) {
      this.form.reset({
        primaryColor: '#2563eb',
        designStyle: 'modern'
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });

      const firstError = document.querySelector('.error-input');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    this.loading = true;
    const headers = new HttpHeaders({
      'x-api-key': this.API_KEY,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    try {
      const currentUser = this.authService.getCurrentUser();
      const formData = {
        ...this.form.value,
        userId: currentUser?.id,
        userEmail: currentUser?.email,
        generatedAt: new Date().toISOString()
      };

      const res = await firstValueFrom(
        this.http.post<MockupResponse>(this.API_URL, { form: formData }, { headers })
      );

      this.previews.add({
        html: res?.html ?? '',
        form: formData
      });

      await this.router.navigate(['/preview']);

    } catch (err: any) {
      console.error('[mockup] API call failed:', err);

      let message = 'Ein Fehler ist aufgetreten.';
      if (err.status === 401) {
        message = 'Sitzung abgelaufen. Bitte erneut anmelden.';
        this.authService.logout();
      } else if (err.status === 0) {
        message = 'Keine Verbindung zum Server.';
      }

      alert(message);
    } finally {
      this.loading = false;
    }
  }
}