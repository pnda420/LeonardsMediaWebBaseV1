import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService, NewsletterSubscriber } from '../../../api/api.service';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-admin-newsletter',
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent],
  templateUrl: './admin-newsletter.component.html',
  styleUrl: './admin-newsletter.component.scss'
})
export class AdminNewsletterComponent implements OnInit {
  subscribers: NewsletterSubscriber[] = [];
  loading = true;
  error = '';
  copiedEmail = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void { this.loadSubscribers(); }

  trackByEmail = (_: number, s: NewsletterSubscriber) => s.email;

  loadSubscribers(): void {
    this.loading = true; this.error = '';
    this.apiService.getNewsletterSubscribers().subscribe({
      next: (res) => { this.subscribers = res.subscribers || []; },
      error: (err) => { console.error('Error loading newsletter subscribers:', err); this.error = 'Fehler beim Laden der Abonnenten'; },
      complete: () => { this.loading = false; }
    });
  }

  copyEmail(email: string): void {
    navigator.clipboard.writeText(email).then(() => {
      this.copiedEmail = email;
      setTimeout(() => this.copiedEmail = '', 2000);
    });
  }

  copyAllEmails(): void {
    // newline-separiert (besser für Paste in Tools), fällt auf Komma zurück
    const list = this.subscribers.map(s => s.email).join('\n');
    navigator.clipboard.writeText(list).then(() => {
      // unobtrusive Feedback ohne alert? -> optional toast-Komponente
      console.info('Alle E-Mail-Adressen kopiert.');
    });
  }

  exportToCSV(): void {
    // robustes CSV mit Escaping + Semikolon als Trennzeichen (DE)
    const headers = ['E-Mail', 'Status', 'Angemeldet am'];
    const rows = this.subscribers.map(s => [
      s.email,
      s.isActive ? 'Aktiv' : 'Inaktiv',
      this.formatDate(s.subscribedAt)
    ]);

    const esc = (v: string) => {
      const value = String(v ?? '');
      // wenn ;," oder newline vorkommt -> in Anführungszeichen + doppelte Quotes escapen
      return /[;"\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
    };

    const csv = [
      headers.map(esc).join(';'),
      ...rows.map(r => r.map(esc).join(';'))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const min = Math.floor(diffMs / 60000);
    const h = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (min < 1) return 'Gerade eben';
    if (min < 60) return `Vor ${min} Min.`;
    if (h < 24) return `Vor ${h} Std.`;
    if (days < 7) return `Vor ${days} Tag${days > 1 ? 'en' : ''}`;
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getActiveCount(): number { return this.subscribers.filter(s => s.isActive).length; }
  getInactiveCount(): number { return this.subscribers.filter(s => !s.isActive).length; }
}
