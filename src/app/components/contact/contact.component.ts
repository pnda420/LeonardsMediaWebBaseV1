import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from "../../shared/page-title/page-title.component";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastService } from '../../shared/toasts/toast.service';

type State = 'idle' | 'loading' | 'success' | 'error';

// Interface für Quick Contact Methoden
export interface QuickContact {
  icon: string;
  title: string;
  value: string;
  link: string; // mailto: oder tel:
}

// Interface für Service-Optionen
export interface ServiceOption {
  value: string;
  label: string;
}

// Vereinfachte Contact-Konfiguration - nur das Wichtigste
export interface ContactPageConfig {
  pageTitle: string;

  // Quick Contacts (E-Mail, Telefon, etc.)
  quickContacts: QuickContact[];

  // Service Optionen im Dropdown (optional: wenn leer, wird Feld nicht angezeigt)
  serviceOptions: ServiceOption[];
  showServiceField: boolean; // Toggle für das Service-Feld

  // Privacy Link
  privacyLink: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [PageTitleComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

  // Nur die wichtigsten Daten konfigurierbar
  contactConfig: ContactPageConfig = {
    pageTitle: 'Kontakt',

    quickContacts: [
      {
        icon: 'mail',
        title: 'E-Mail schreiben',
        value: 'tom@leonardsmedia.de',
        link: 'mailto:tom@leonardsmedia.de'
      }
      // Weitere hinzufügen:
      // {
      //   icon: 'phone',
      //   title: 'Anrufen',
      //   value: '+49 123 456789',
      //   link: 'tel:+49123456789'
      // }
    ],

    // Service-Feld ein-/ausschalten
    showServiceField: true,
    serviceOptions: [
      { value: '', label: 'Noch nicht sicher / Beratung gewünscht' },
      { value: 'website', label: 'Website Entwicklung' },
      { value: 'webapp', label: 'Web-Anwendung' },
      { value: 'consulting', label: 'Beratung' },
      { value: 'other', label: 'Sonstiges' }
    ],

    privacyLink: '/policy'
  };

  contactForm!: FormGroup;
  state: State = 'idle';
  busy = false;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private toasts: ToastService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      service: [''],
      message: [''],
      callback: [false],
      phone: ['']
    });
  }

  submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.busy = true;
    this.disableForm();
    this.state = 'loading';

    // Form Daten loggen
    console.log('Contact Form Data:', this.contactForm.getRawValue());

    // Demo: Nach 2 Sekunden Erfolg anzeigen
    setTimeout(() => {
      this.state = 'success';
      this.busy = false;
      this.enableForm();
    }, 2000);
  }

  newMessage() {
    this.resetForm();
  }

  private resetForm() {
    this.state = 'idle';
    this.busy = false;
    this.contactForm.reset();
    this.enableForm();
  }

  private disableForm() {
    this.contactForm.disable();
  }

  private enableForm() {
    this.contactForm.enable();
  }
}