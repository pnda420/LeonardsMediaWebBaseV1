import { Component } from '@angular/core';
import { PageTitleComponent } from "../../shared/page-title/page-title.component";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconComponent } from "../../shared/icon/icon.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PageTitleComponent, RouterLink, CommonModule, IconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(public router: Router) { }

  usp = [
    { icon: 'filter_alt', title: 'Pragmatisch', text: 'Fokus auf das Nötige. Keine Spielereien, kein Overengineering.' },
    { icon: 'schema',     title: 'Wartbar',     text: 'Saubere Architektur, klare Schnittstellen und nachvollziehbare Doku.' },
    { icon: 'gpp_good',   title: 'Verlässlich', text: 'Realistische Zusagen. Termine und Budget im Blick.' }
  ];
  

  services = [
    {
      title: 'Frontend (Angular & TypeScript)',
      text: 'SPAs, Komponenten, Routing, Reactive Forms, State, Performance.',
      link: '/services/frontend'
    },
    {
      title: 'Backend (NestJS / Node.js)',
      text: 'REST-APIs, Auth/Autorisierung, Validation, Testing, Logging.',
      link: '/services/backend'
    },
    {
      title: 'Datenbank & Betrieb',
      text: 'PostgreSQL-Schema & Migrations, Docker, CI/CD, Deployment.',
      link: '/services/ops'
    }
  ];

  testimonials = [
    {
      quote: 'Saubere Umsetzung, klarer Code. Übergabe war problemlos.',
      name: 'M. Weber', role: 'GF, Weber & Co.'
    },
    {
      quote: 'Termin gehalten, Budget eingehalten. Kommunikation auf den Punkt.',
      name: 'A. Krüger', role: 'IT-Leitung, KRG'
    },
    {
      quote: 'Schnelle Reaktion, pragmatische Lösungen – ohne Overhead.',
      name: 'L. Hoffmann', role: 'Projektleitung, HM GmbH'
    }
  ];

}
