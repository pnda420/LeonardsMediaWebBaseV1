import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PreviewService } from '../../../state/preview.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApiService, PageAiMockupDto, PageAiMockupResponse } from '../../../api/api.service';

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
  selectedQuality: 'fast' | 'balanced' | 'premium' = 'balanced';
  showQualitySelector = false;

  websiteTypes: WebsiteType[] = [
    { value: 'praesentation', label: 'Präsentation', icon: '🎯', description: 'Portfolio, Firma', },
    { value: 'landing', label: 'Landingpage', icon: '🚀', description: 'Produkt/Dienstleistung', },
    { value: 'event', label: 'Event', icon: '📅', description: 'Veranstaltung', }
  ];

  customerTypes = [
    { value: 'private', label: 'Privat / Verein', icon: '👤' },
    { value: 'business', label: 'Firma / Unternehmen', icon: '🏢' }
  ];

  private apiService = inject(ApiService);
  private previews = inject(PreviewService);
  public authService = inject(AuthService);
  public router = inject(Router);

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

  toggleQualitySelector(): void {
    this.showQualitySelector = !this.showQualitySelector;
  }

  selectQuality(quality: 'fast' | 'balanced' | 'premium'): void {
    this.selectedQuality = quality;
    this.showQualitySelector = false;
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

    try {
      const currentUser = this.authService.getCurrentUser();

      const dto: PageAiMockupDto = {
        form: {
          ...this.form.value,
          userId: currentUser?.id,
          userEmail: currentUser?.email,
          generatedAt: new Date().toISOString()
        }
      };

      // Call API mit quality parameter
      this.apiService.generateWebsiteMockup(dto, this.selectedQuality).subscribe({
        next: (response: PageAiMockupResponse) => {
          console.log('✅ Website generiert!', response.metadata);

          this.previews.addTemporary({
            html: response.html,
            form: dto.form,
            pageId: response.pageId
          });

          this.router.navigate(['/preview']);
          this.loading = false;
        },
        error: (err: any) => {
          console.error('[mockup] API call failed:', err);

          let message = 'Ein Fehler ist aufgetreten.';
          if (err.status === 401) {
            message = 'Sitzung abgelaufen. Bitte erneut anmelden.';
            this.authService.logout();
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