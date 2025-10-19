import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/api.service';

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

  constructor(private apiService: ApiService) { }

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

    this.apiService.subscribeNewsletter(this.email).subscribe({
      next: (response) => {
        // console.log('Newsletter subscription successful:', response);
        this.submitted = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Newsletter subscription failed:', error);
        this.isLoading = false;

        // Freundliche Fehlermeldung anzeigen
        if (error.status === 409) {
          this.errorMessage = 'Diese E-Mail ist bereits angemeldet';
        } else {
          this.errorMessage = 'Etwas ist schiefgelaufen. Bitte versuche es später nochmal.';
        }

        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }
}