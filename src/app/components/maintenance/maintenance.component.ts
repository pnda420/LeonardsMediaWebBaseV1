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

  onSubmit(): void {
    if (this.email) {
      this.submitted = true;


      console.log('Email submitted:', this.email);

      setTimeout(() => {
        this.submitted = false;
        this.email = '';
      }, 3000);
    }
  }
}
