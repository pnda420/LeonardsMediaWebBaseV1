import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss'
})
export class MaintenanceComponent {
  email: string = '';
  submitted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  // Verschlüsselte E-Mail-Adresse (Base64)
  private encryptedEmail = 'dG9tQGxlb25hcmRzbWVkaWEuZGU=';
  contactEmail: string = '';

  features = [
    {
      icon: '⚡',
      title: 'Schnelle Umsetzung',
      description: 'Lean Development für schnelle Ergebnisse'
    },
    {
      icon: '💰',
      title: 'Faire Preise',
      description: 'Transparent und ohne versteckte Kosten'
    },
    {
      icon: '🛠',
      title: 'Wartbarer Code',
      description: 'Saubere Architektur für die Zukunft'
    }
  ];

  techStack = [
    'Angular',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'REST APIs',
    'Git',
    'Docker',
    'Cloud Hosting'
  ];

  constructor() {
    // E-Mail erst beim Laden der Component entschlüsseln
    this.contactEmail = this.decryptEmail(this.encryptedEmail);
  }

  private decryptEmail(encrypted: string): string {
    try {
      return atob(encrypted);
    } catch (e) {
      return '';
    }
  }

  getMailtoLink(): string {
    return `mailto:${this.contactEmail}`;
  }

  // Alternative: E-Mail erst bei Klick entschlüsseln und öffnen
  openEmail(event: Event): void {
    event.preventDefault();
    const email = this.decryptEmail(this.encryptedEmail);
    window.location.href = `mailto:${email}`;
  }

  onSubmit(): void {
    if (!this.email) {
      return;
    }

    // Einfache E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Bitte gib eine gültige E-Mail-Adresse ein';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

  }
}