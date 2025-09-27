import { Component } from '@angular/core';
import { PageTitleComponent } from "../../shared/page-title/page-title.component";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PageTitleComponent, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(public router: Router) {}

  usp = [
    { icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`, title: 'Zuverlässig', text: 'Planbare Umsetzung ohne Überraschungen.' },
    { icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10m0 0L8 14m4-4 4 4"/><circle cx="12" cy="6" r="2"/></svg>`, title: 'Skalierbar', text: 'Lösungen wachsen mit Ihrem Bedarf.' },
    { icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>`, title: 'Transparent', text: 'Klare Angebote, klare Kommunikation.' },
  ];

  services = [
    { title: 'Systemintegration', text: 'Netzwerke, Server, Cloud – stabil und sicher aufgesetzt.', link: '/services/integration' },
    { title: 'Softwareentwicklung', text: 'Web & API – sauber, wartbar, testbar.', link: '/services/dev' },
    { title: 'Betrieb & Support', text: 'Monitoring, Updates, Incident-Handling – ohne Theater.', link: '/services/ops' },
  ];

  testimonials = [
    { quote: 'Schnelle, saubere Umsetzung. Kommunikation auf den Punkt.', name: 'M. Weber', role: 'GF, Weber & Co.' },
    { quote: 'Stabile Systeme, nachvollziehbare Doku. Genau das gebraucht.', name: 'A. Krüger', role: 'IT-Leitung, KRG' },
    { quote: 'Kein Overengineering. Termin gehalten, Budget eingehalten.', name: 'L. Hoffmann', role: 'Projektleitung, HM GmbH' },
  ];
}
