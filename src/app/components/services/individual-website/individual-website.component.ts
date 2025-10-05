import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';

@Component({
  selector: 'app-individual-website',
  standalone: true,
  imports: [FormsModule, CommonModule, PageTitleComponent],
  templateUrl: './individual-website.component.html',
  styleUrl: './individual-website.component.scss'
})
export class IndividualWebsiteComponent {

  constructor(public router: Router) { }

  // Individual Website - Includes
  img = 'assets/cards/2-min.png';

  includes = [
    {
      title: 'Ausführliche Analyse',
      text: 'Discovery-Phase mit User Stories, Datenmodell-Design, technischer Architektur. Detailliertes Konzept vor Start.'
    },
    {
      title: 'Custom Design & UX',
      text: 'Individuelle UI/UX-Designs, klickbare Prototypen, mehrere Feedback-Runden bis alles perfekt sitzt.'
    },
    {
      title: 'Vollständige Entwicklung',
      text: 'Frontend (Angular/TS), Backend (Node.js/NestJS), Datenbank (PostgreSQL). Sauberer, wartbarer Code nach Best Practices.'
    },
    {
      title: 'Custom Features',
      text: 'Login-Systeme, Benutzerrollen, Dashboards, komplexe Formulare, Buchungssysteme - was immer du brauchst.'
    },
    {
      title: 'API-Integrationen',
      text: 'Anbindung externer Dienste (Payment, CRM, E-Mail, etc.). REST-APIs für eigene Schnittstellen.'
    },
    {
      title: 'Datenbank & Backend',
      text: 'PostgreSQL-Setup mit Migrations, Caching (Redis), optimierte Queries, Backup-Strategie.'
    },
    {
      title: 'Testing & QA',
      text: 'Umfangreiche Tests (Unit, Integration, E2E). Performance- und Security-Checks. Bug-Fixing inklusive.'
    },
    {
      title: 'Deployment & DevOps',
      text: 'Docker-Setup, CI/CD-Pipeline, Cloud-Hosting, Monitoring, automatische Deployments.'
    },
    {
      title: 'Dokumentation',
      text: 'Technische Dokumentation, API-Specs, Admin-Anleitung, Code-Kommentare für zukünftige Entwicklung.'
    },
    {
      title: 'Schulung & Support',
      text: 'Einweisung für Admin-Bereiche, 30 Tage Priority-Support nach Launch. Optional: Wartungsvertrag.'
    },
    {
      title: 'Skalierbarkeit',
      text: 'Architektur für Wachstum ausgelegt. Performance-Optimierung, Caching-Strategien, Load-Balancing-Ready.'
    },
    {
      title: 'Security & DSGVO',
      text: 'Sichere Authentifizierung, Datenverschlüsselung, DSGVO-konforme Datenverarbeitung, Security-Audits.'
    }
  ];

  // Individual Website - FAQ
  faq = [
    {
      q: 'Wie lange dauert so ein Projekt?',
      a: [
        'Das hängt stark vom Umfang ab. Typischerweise 8-16 Wochen von Konzept bis Launch.',
        'In der Discovery-Phase (1-2 Wochen) erstellen wir einen detaillierten Zeitplan mit Meilensteinen.'
      ]
    },
    {
      q: 'Wie wird der Preis kalkuliert?',
      a: [
        'Nach der Discovery-Phase bekommst du ein Festpreis-Angebot basierend auf dem finalen Konzept.',
        'Basis ab 5.000 €. Komplexere Projekte mit vielen Features können 10.000-30.000 € oder mehr kosten.',
        'Transparente Kalkulation - du weißt vorher genau, was es kostet.'
      ]
    },
    {
      q: 'Kann ich das Projekt später erweitern?',
      a: [
        'Absolut. Die Architektur ist so gebaut, dass neue Features hinzugefügt werden können.',
        'Du bekommst den kompletten Quellcode und Dokumentation - auch andere Entwickler können später dran arbeiten.'
      ]
    },
    {
      q: 'Was passiert nach dem Launch?',
      a: [
        '30 Tage Priority-Support inklusive für Bug-Fixes und kleine Anpassungen.',
        'Optional: Wartungsvertrag für laufenden Support, Updates und neue Features.',
        'Oder du übernimmst selbst - mit vollständiger Dokumentation und Einweisung.'
      ]
    },
    {
      q: 'Wer hostet die Anwendung?',
      a: [
        'Ich setze das Hosting auf (z.B. Cloud-Provider wie Hetzner, DigitalOcean, AWS).',
        'Du kannst selbst hosten oder ich übernehme das Management gegen monatliche Gebühr.',
        'Backup-Strategien und Monitoring sind im Setup enthalten.'
      ]
    },
    {
      q: 'Bekomme ich den Quellcode?',
      a: [
        'Ja, vollständig. Nach Zahlungseingang gehört der gesamte Code dir.',
        'Inklusive Dokumentation, damit du oder andere Entwickler später damit arbeiten können.'
      ]
    },
    {
      q: 'Was unterscheidet das von No-Code/Low-Code-Tools?',
      a: [
        'Maximale Flexibilität - keine Limitierungen durch Plattform-Beschränkungen.',
        'Bessere Performance und Skalierbarkeit.',
        'Keine monatlichen Lizenzkosten für Tools.',
        'Volle Kontrolle über Code, Daten und Hosting.'
      ]
    },
    {
      q: 'Brauche ich technisches Wissen?',
      a: [
        'Für die Nutzung: Nein. Admin-Bereiche werden intuitiv gestaltet.',
        'Für Updates am Code: Ja, oder du beauftragst mich/andere Entwickler für Änderungen.',
        'Ich erstelle Dokumentation für beide Szenarien.'
      ]
    }
  ];

}
