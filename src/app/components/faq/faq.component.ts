import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';

type FaqItem = { id: string; q: string; a: string[]; list?: string[] };

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTitleComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  constructor(public router: Router) { }

  q = '';
  expandAll = false;

  faqs: FaqItem[] = [
    {
      id: 'start',
      q: 'Wie starten wir?',
      a: [
        'Kurzes Erstgespräch (online), Ziel/Scope klären, danach erhalten Sie ein konkretes Angebot.',
        'Keine Verpflichtung – ehrliche Einschätzung, auch wenn etwas nicht passt.'
      ]
    },
    {
      id: 'scope',
      q: 'Welche Leistungen übernimmst du konkret?',
      a: [
        'Webentwicklung mit Angular (Frontend) und NestJS/Node.js (API).',
        'PostgreSQL-Datenbank, Docker, einfache CI/CD-Pipelines, Deployment.'
      ],
      list: ['SPAs, Komponenten, Routing, Forms', 'REST-APIs, Auth, Validation, Logging', 'Schema & Migrations, Backups (nach Absprache)']
    },
    {
      id: 'timeline',
      q: 'Wie schnell geht das?',
      a: [
        'Kommt auf Umfang und Auslastung an. Kleine Aufgaben oft in wenigen Werktagen, Projekte nach Absprache.',
        'Realistische Zeitpläne sind mir wichtiger als schnelle Versprechen.'
      ]
    },
    {
      id: 'pricing',
      q: 'Wie rechnest du ab?',
      a: [
        'Entweder Festpreis pro klar abgegrenztem Scope oder nach Tages-/Stundensatz.',
        'Im Angebot steht, was enthalten ist, welche Annahmen gelten und was extra wäre.'
      ]
    },
    {
      id: 'ownership',
      q: 'Wem gehört der Code?',
      a: [
        'Nach Zahlung geht das Nutzungsrecht an Sie über (vereinbart im Angebot).',
        'Repository-Übergabe inkl. Doku. Kein Vendor-Lock-in.'
      ]
    },
    {
      id: 'support',
      q: 'Bietest du Wartung und Support an?',
      a: [
        'Ja, nach Bedarf. Reaktionszeiten/SLA werden klar definiert.',
        'Kleine Weiterentwicklungen sind möglich, solange der Scope realistisch bleibt.'
      ]
    },
    {
      id: 'hosting',
      q: 'Übernimmst du das Hosting?',
      a: [
        'Hosting kann gestellt werden (z. B. Kunde, Cloudanbieter). Ich unterstütze bei Setup und Deployment.',
        'Betrieb/Monitoring nach Absprache – kein Full-Service-Rechenzentrum.'
      ]
    },
    {
      id: 'security',
      q: 'Wie gehst du mit Sicherheit und Datenschutz um?',
      a: [
        'Solide Basis: Zugriff nur nach Need-to-know, Secrets nicht im Code, Logs ohne unnötige Personenbezüge.',
        'AVV möglich, falls erforderlich. Keine Marketing-Tracking-Spielereien.'
      ]
    },
    {
      id: 'quality',
      q: 'Wie stellst du Qualität sicher?',
      a: [
        'Klare Architektur, Code-Reviews (sofern sinnvoll), linters/formatter, sinnvolle Tests – ohne Overengineering.',
        'Nachvollziehbare Doku und saubere Übergabe.'
      ]
    },
    {
      id: 'change',
      q: 'Was, wenn sich der Scope ändert?',
      a: [
        'Kleine Änderungen gehen wir pragmatisch mit. Größere Änderungen werden kurz bewertet und separat angeboten.',
        'So bleibt Budget und Termin planbar.'
      ]
    },
    {
      id: 'cancel',
      q: 'Was passiert bei Abbruch?',
      a: [
        'Bis dahin erbrachte Leistungen werden abgerechnet. Sie erhalten den aktuellen Stand inkl. Code und Doku.',
        'Besser ist: früh klären, wenn etwas nicht passt – dann lässt sich gegensteuern.'
      ]
    },
    {
      id: 'status',
      q: 'Gibt es einen Systemstatus?',
      a: [
        'Ja. Für laufende Projekte gibt es eine schlanke Status-Übersicht (Uptime, Latenzen, letzte Checks).',
        'Das ist kein großer „Status-Page-Dienst“, sondern pragmatisch umgesetzt.'
      ]
    }
  ];

  get filtered(): FaqItem[] {
    const q = this.q.trim().toLowerCase();
    if (!q) return this.faqs;
    return this.faqs.filter(f =>
      f.q.toLowerCase().includes(q) ||
      f.a.join(' ').toLowerCase().includes(q) ||
      (f.list?.join(' ').toLowerCase().includes(q) ?? false)
    );
  }

  setAll(open: boolean) { this.expandAll = open; }

  trackById(_: number, f: FaqItem) { return f.id; }
}
