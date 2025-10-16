// admin-newsletter.component.ts
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
  loading: boolean = true;
  error: string = '';
  copiedEmail: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadSubscribers();
  }

  loadSubscribers(): void {
    this.loading = true;
    this.error = '';

    this.apiService.getNewsletterSubscribers().subscribe({
      next: (response) => {
        this.subscribers = response.subscribers;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading newsletter subscribers:', err);
        this.error = 'Fehler beim Laden der Abonnenten';
        this.loading = false;
      }
    });
  }

  copyEmail(email: string): void {
    navigator.clipboard.writeText(email).then(() => {
      this.copiedEmail = email;
      setTimeout(() => {
        this.copiedEmail = '';
      }, 2000);
    });
  }

  copyAllEmails(): void {
    const emails = this.subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails).then(() => {
      alert('✅ Alle E-Mail-Adressen kopiert!');
    });
  }

  exportToCSV(): void {
    const headers = ['E-Mail', 'Status', 'Angemeldet am'];
    const rows = this.subscribers.map(s => [
      s.email,
      s.isActive ? 'Aktiv' : 'Inaktiv',
      this.formatDate(s.subscribedAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `Vor ${diffMins} Min.`;
    if (diffHours < 24) return `Vor ${diffHours} Std.`;
    if (diffDays < 7) return `Vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;

    return d.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getActiveCount(): number {
    return this.subscribers.filter(s => s.isActive).length;
  }

  getInactiveCount(): number {
    return this.subscribers.filter(s => !s.isActive).length;
  }
}