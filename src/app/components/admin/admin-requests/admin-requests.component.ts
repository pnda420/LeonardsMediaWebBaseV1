import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from "../../../shared/page-title/page-title.component";
import { ContactRequest, ApiService, ServiceType } from '../../../api/api.service';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";

type Tab = 'unprocessed' | 'processed';

@Component({
  selector: 'app-admin-requests',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, AdminHeaderComponent],
  templateUrl: './admin-requests.component.html',
  styleUrl: './admin-requests.component.scss'
})
export class AdminRequestsComponent implements OnInit {
  activeTab: Tab = 'unprocessed';
  unprocessedRequests: ContactRequest[] = [];
  processedRequests: ContactRequest[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  get currentRequests(): ContactRequest[] {
    return this.activeTab === 'unprocessed'
      ? this.unprocessedRequests
      : this.processedRequests;
  }

  switchTab(tab: Tab) {
    this.activeTab = tab;
  }

  loadRequests() {
    this.loading = true;
    this.error = '';

    // Lade beide Listen parallel
    Promise.all([
      this.api.getUnprocessedContactRequests().toPromise(),
      this.api.getAllContactRequests().toPromise()
    ])
      .then(([unprocessed, all]) => {
        this.unprocessedRequests = unprocessed || [];

        // Bearbeitete = alle außer unbearbeitete
        const unprocessedIds = new Set(this.unprocessedRequests.map(r => r.id));
        this.processedRequests = (all || []).filter(r => !unprocessedIds.has(r.id));

        this.loading = false;
      })
      .catch((err) => {
        console.error('Fehler beim Laden der Anfragen:', err);
        this.error = 'Fehler beim Laden der Anfragen';
        this.loading = false;
      });
  }

  markAsProcessed(id: string) {
    this.api.markContactRequestAsProcessed(id).subscribe({
      next: () => {
        // Request von unprocessed zu processed verschieben
        const request = this.unprocessedRequests.find(r => r.id === id);
        if (request) {
          this.unprocessedRequests = this.unprocessedRequests.filter(r => r.id !== id);
          this.processedRequests.unshift({ ...request, isProcessed: true });
        }
      },
      error: (err) => {
        console.error('Fehler beim Markieren:', err);
        alert('Fehler beim Markieren der Anfrage');
      }
    });
  }

  markAsUnprocessed(id: string) {
    this.api.updateContactRequest(id, { isProcessed: false }).subscribe({
      next: () => {
        // Request von processed zu unprocessed verschieben
        const request = this.processedRequests.find(r => r.id === id);
        if (request) {
          this.processedRequests = this.processedRequests.filter(r => r.id !== id);
          this.unprocessedRequests.unshift({ ...request, isProcessed: false });
        }
      },
      error: (err) => {
        console.error('Fehler beim Markieren:', err);
        alert('Fehler beim Markieren der Anfrage');
      }
    });
  }

  deleteRequest(id: string) {
    if (!confirm('Anfrage wirklich löschen?')) {
      return;
    }

    this.api.deleteContactRequest(id).subscribe({
      next: () => {
        this.unprocessedRequests = this.unprocessedRequests.filter(r => r.id !== id);
        this.processedRequests = this.processedRequests.filter(r => r.id !== id);
      },
      error: (err) => {
        console.error('Fehler beim Löschen:', err);
        alert('Fehler beim Löschen der Anfrage');
      }
    });
  }

  getServiceLabel(type: ServiceType): string {
    const labels: { [key in ServiceType]: string } = {
      [ServiceType.NOT_SURE]: 'Noch nicht sicher / Beratung',
      [ServiceType.SIMPLE_WEBSITE]: 'Einfache Website',
      [ServiceType.STANDARD_WEBSITE]: 'Standard Website',
      [ServiceType.INDIVIDUAL_WEBSITE]: 'Individual Website',
      [ServiceType.SEO]: 'SEO Optimierung'
    };
    return labels[type] || type;
  }

  formatDate(dateString: Date): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `vor ${diffMins} Min`;
    } else if (diffHours < 24) {
      return `vor ${diffHours} Std`;
    } else if (diffDays === 1) {
      return 'Gestern';
    } else if (diffDays < 7) {
      return `vor ${diffDays} Tagen`;
    } else {
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  copyEmail(email: string) {
    navigator.clipboard.writeText(email);
  }

  copyPhone(phone: string) {
    navigator.clipboard.writeText(phone);
  }
}