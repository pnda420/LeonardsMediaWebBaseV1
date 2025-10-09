import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';

@Component({
  selector: 'app-standard-website',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTitleComponent],
  templateUrl: './standard-website.component.html',
  styleUrl: './standard-website.component.scss'
})
export class StandardWebsiteComponent {

  constructor(public router: Router) { }

  img = 'assets/cards/standard-min.png';


  // Standard Website - Includes
  includes = [
    {
      title: 'Umfassende Planung',
      text: 'Strategie-Workshop zur Definition von Zielen, Zielgruppe und Seitenstruktur. Content-Strategie für alle Bereiche.'
    },
    {
      title: 'Professionelles Design',
      text: 'Individuelle Designs für alle wichtigen Seiten. Wireframes, Mockups, 2-3 Feedback-Runden bis alles perfekt ist.'
    },
    {
      title: '3-8 Unterseiten',
      text: 'Flexible Struktur je nach Bedarf: Startseite, Über uns, Leistungen, Referenzen, Blog, Kontakt. Alles mobil optimiert.'
    },
    {
      title: 'Navigation & Footer',
      text: 'Intuitive Hauptnavigation, strukturierter Footer mit allen wichtigen Links, Breadcrumbs bei Bedarf.'
    },
    {
      title: 'Blog-System (optional)',
      text: 'Einfaches CMS für News, Artikel oder Updates. Du kannst selbst Beiträge erstellen und veröffentlichen.'
    },
    {
      title: 'Saubere Entwicklung',
      text: 'Moderne Umsetzung mit Angular/TypeScript. Wartbarer Code, schnelle Ladezeiten, optimierte Performance.'
    },
    {
      title: 'Erweiterte SEO',
      text: 'On-Page-Optimierung für alle Seiten, strukturierte Daten, Sitemap, optimierte Meta-Daten, SEO-Audit nach Launch.'
    },
    {
      title: 'Kontaktformulare',
      text: 'Mehrere Formulare möglich (Kontakt, Anfrage, Newsletter). Spam-Schutz, E-Mail-Benachrichtigungen.'
    },
    {
      title: 'Analytics & Tracking',
      text: 'Google Analytics oder Alternative, Conversion-Tracking, Cookie-Banner DSGVO-konform.'
    },
    {
      title: 'Content-Integration',
      text: 'Einbindung deiner Texte, Bilder und Videos. Optional: Unterstützung bei Content-Erstellung.'
    },
    {
      title: 'Testing & Launch',
      text: 'Ausführliche Tests auf allen Geräten, Browser-Kompatibilität, Performance-Check, professioneller Go-Live.'
    },
    {
      title: 'Schulung & Übergabe',
      text: 'Einweisung ins CMS (falls Blog), Dokumentation für Updates, 14 Tage Support nach Launch inklusive.'
    }
  ];

  // Standard Website - FAQ
  faq = [
    {
      q: 'Wie lange dauert die Umsetzung?',
      a: [
        'Typischerweise 3-6 Wochen, abhängig von der Anzahl der Seiten und Content-Bereitstellung.',
        'Nach dem Kickoff erstelle ich einen detaillierten Zeitplan mit Meilensteinen.'
      ]
    },
    {
      q: 'Muss ich die Texte selbst schreiben?',
      a: [
        'Idealerweise ja - du kennst dein Business am besten.',
        'Ich kann aber bei der Struktur helfen oder Texte überarbeiten.',
        'Professionelles Copywriting kann ich gegen Aufpreis vermitteln.'
      ]
    },
    {
      q: 'Kann ich später selbst Inhalte ändern?',
      a: [
        'Bei statischen Seiten: Änderungen über mich oder mit technischem Know-how.',
        'Mit Blog-System: Ja, du kannst Beiträge selbst erstellen und bearbeiten.',
        'Kleine Textänderungen auf Anfrage oft kostenlos in den ersten Wochen.'
      ]
    },
    {
      q: 'Brauche ich ein Blog?',
      a: [
        'Nicht zwingend. Ein Blog hilft bei SEO und zeigt Expertise.',
        'Macht nur Sinn, wenn du regelmäßig Content veröffentlichen willst.',
        'Wir besprechen im Kickoff, was für dich sinnvoll ist.'
      ]
    },
    {
      q: 'Was kostet Hosting und Domain?',
      a: [
        'Domain: ca. 10-20 Euro/Jahr',
        'Hosting: ab 5-20 Euro/Monat je nach Anbieter und Traffic',
        'Ich helfe bei der Auswahl und richte alles ein.'
      ]
    },
    {
      q: 'Kann ich später weitere Seiten hinzufügen?',
      a: [
        'Ja, jederzeit. Die Struktur ist so angelegt, dass Erweiterungen problemlos möglich sind.',
        'Neue Seiten können gegen Aufpreis ergänzt werden.'
      ]
    },
    {
      q: 'Was unterscheidet das von der einfachen Website?',
      a: [
        'Mehrere separate Unterseiten statt einer langen Seite',
        'Professionelle Navigation und Struktur',
        'Blog-System optional verfügbar',
        'Umfangreichere SEO-Optimierung',
        'Besser für etablierte Businesses mit mehr Content'
      ]
    },
    {
      q: 'Bekomme ich auch Fotos und Grafiken?',
      a: [
        'Stockfotos kann ich einbinden (Lizenzkosten trägt der Kunde).',
        'Eigene Fotos sind immer besser - die bindest du bereit.',
        'Grafik-Design gegen Aufpreis möglich.'
      ]
    }
  ];

}
