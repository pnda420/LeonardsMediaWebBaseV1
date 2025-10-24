import { Component } from '@angular/core';
import { PageTitleComponent } from "../../shared/page-title/page-title.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Interface für Profilinformationen
export interface ProfileData {
  name: string;
  tagline: string;
  imagePath: string;
  imageAlt: string;
  story: string[];
  facts: ProfileFact[];
}

export interface ProfileFact {
  label: string;
  value: string;
}

export interface ProfileAction {
  label: string;
  style: 'primary' | 'ghost' | 'secondary';
  route?: string;
  action?: () => void;
}

// Interface für die komplette About-Seite mit mehreren Personen
export interface AboutPageConfig {
  pageTitle: string;
  teamIntro?: string; // Optional: Einleitungstext für das Team
  profiles: ProfileData[];
  actions: ProfileAction[]; // Gemeinsame Actions für alle Profile
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [PageTitleComponent, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  aboutConfig: AboutPageConfig = {
    pageTitle: 'Unser Team',
    teamIntro: 'Wir sind ein engagiertes Team aus Entwicklern, Designern und Strategen.',
    profiles: [
      {
        name: 'Tom Leonards',
        tagline: 'Full-Stack Entwickler',
        imagePath: 'assets/tom.png',
        imageAlt: 'Tom Leonards',
        story: ['Entwickler mit Fokus auf Backend...'],
        facts: [
          { label: 'Rolle', value: 'Lead Developer' },
          { label: 'Erfahrung', value: '5+ Jahre' }
        ]
      },
      {
        name: 'Sarah Schmidt',
        tagline: 'UI/UX Designerin',
        imagePath: 'assets/sarah.png',
        imageAlt: 'Sarah Schmidt',
        story: ['Designerin mit Leidenschaft für User Experience...'],
        facts: [
          { label: 'Rolle', value: 'Senior Designer' },
          { label: 'Erfahrung', value: '7+ Jahre' }
        ]
      },
      {
        name: 'Max Weber',
        tagline: 'DevOps Engineer',
        imagePath: 'assets/max.png',
        imageAlt: 'Max Weber',
        story: ['Spezialist für Cloud-Infrastruktur...'],
        facts: [
          { label: 'Rolle', value: 'DevOps Lead' },
          { label: 'Erfahrung', value: '6+ Jahre' }
        ]
      }
    ],
    actions: [
      { label: 'Team kontaktieren', style: 'primary', route: '/contact' },
      { label: 'Projekte ansehen', style: 'ghost', route: '/portfolio' }
    ]
  };

  constructor(public router: Router) { }

  handleAction(action: ProfileAction) {
    if (action.action) {
      action.action();
    } else if (action.route) {
      this.router.navigate([action.route]);
    }
  }
}