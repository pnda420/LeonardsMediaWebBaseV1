import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";
import { ConfirmationConfig, ConfirmationComponent } from '../../../shared/confirmation/confirmation.component';
import { ContactRequest, ApiService, ServiceType } from '../../../api/api.service';

type Tab = 'unprocessed' | 'processed';

@Component({
  selector: 'app-admin-requests',
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent, ConfirmationComponent],
  templateUrl: './admin-requests.component.html',
  styleUrl: './admin-requests.component.scss'
})
export class AdminRequestsComponent implements OnInit {
  activeTab: Tab = 'unprocessed';
  unprocessedRequests: ContactRequest[] = [];
  processedRequests: ContactRequest[] = [];
  loading = true;
  error = '';

  showModal = false;
  modalLoading = false;
  requestToDelete: string | null = null;

  modalConfig: ConfirmationConfig = {
    title: 'Anfrage löschen',
    message: 'Diese Aktion kann nicht rückgängig gemacht werden.',
    confirmText: 'Ja, löschen',
    cancelText: 'Abbrechen',
    type: 'danger',
    icon: 'delete'
  };

  constructor(private api: ApiService) { }

  ngOnInit(): void { this.loadRequests(); }

  get currentRequests(): ContactRequest[] {
    return this.activeTab === 'unprocessed' ? this.unprocessedRequests : this.processedRequests;
  }

  trackById = (_: number, r: ContactRequest) => r.id;

  switchTab(tab: Tab) { this.activeTab = tab; }

  loadRequests() {
    this.loading = true; this.error = '';
    Promise.all([
      this.api.getUnprocessedContactRequests().toPromise(),
      this.api.getAllContactRequests().toPromise()
    ])
      .then(([unprocessed, all]) => {
        this.unprocessedRequests = unprocessed || [];
        const unprocessedIds = new Set(this.unprocessedRequests.map(r => r.id));
        this.processedRequests = (all || []).filter(r => !unprocessedIds.has(r.id));
      })
      .catch((err) => {
        console.error('Fehler beim Laden der Anfragen:', err);
        this.error = 'Fehler beim Laden der Anfragen';
      })
      .finally(() => this.loading = false);
  }

  markAsProcessed(id: string) {
    this.api.markContactRequestAsProcessed(id).subscribe({
      next: () => {
        const i = this.unprocessedRequests.findIndex(r => r.id === id);
        if (i > -1) {
          const [request] = this.unprocessedRequests.splice(i, 1);
          this.processedRequests.unshift({ ...request, isProcessed: true });
        }
      },
      error: (err) => { console.error('Fehler beim Markieren:', err); alert('Fehler beim Markieren der Anfrage'); }
    });
  }

  markAsUnprocessed(id: string) {
    this.api.updateContactRequest(id, { isProcessed: false }).subscribe({
      next: () => {
        const i = this.processedRequests.findIndex(r => r.id === id);
        if (i > -1) {
          const [request] = this.processedRequests.splice(i, 1);
          this.unprocessedRequests.unshift({ ...request, isProcessed: false });
        }
      },
      error: (err) => { console.error('Fehler beim Markieren:', err); alert('Fehler beim Markieren der Anfrage'); }
    });
  }

  onConfirmDelete() {
    if (!this.requestToDelete) return;
    this.modalLoading = true;
    this.api.deleteContactRequest(this.requestToDelete).subscribe({
      next: () => {
        this.unprocessedRequests = this.unprocessedRequests.filter(r => r.id !== this.requestToDelete);
        this.processedRequests = this.processedRequests.filter(r => r.id !== this.requestToDelete);
        this.showModal = false; this.requestToDelete = null;
      },
      error: (err) => { console.error('Fehler beim Löschen:', err); alert('Fehler beim Löschen der Anfrage'); },
      complete: () => { this.modalLoading = false; }
    });
  }

  onCancelDelete() { this.showModal = false; this.requestToDelete = null; }

  getServiceLabel(type: ServiceType): string {
    const labels: Record<ServiceType, string> = {
      [ServiceType.NOT_SURE]: 'Noch nicht sicher / Beratung',
      [ServiceType.SIMPLE_WEBSITE]: 'Einfache Website',
      [ServiceType.STANDARD_WEBSITE]: 'Standard Website',
      [ServiceType.INDIVIDUAL_WEBSITE]: 'Individual Website',
      [ServiceType.SEO]: 'SEO Optimierung'
    };
    // Fallback auf enum-Wert
    return (type in labels ? labels[type] : String(type)) || '—';
    // Tipp: Wenn ServiceType numerisch ist, ggf. Mapping umdrehen.
  }

  formatDate(dateInput: Date | string): string {
    if (!dateInput) return '—';
    const date = new Date(dateInput);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `vor ${diffMins} Min`;
    if (diffHours < 24) return `vor ${diffHours} Std`;
    if (diffDays === 1) return 'Gestern';
    if (diffDays < 7) return `vor ${diffDays} Tagen`;
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  /** Zeigt ALLE Felder, die nicht schon prominent gerendert werden */
  getAdditionalFields(request: any): Array<{ key: string; value: any; isDate: boolean }> {
    const shown = new Set(['id', 'name', 'email', 'phoneNumber', 'serviceType', 'message', 'createdAt', 'prefersCallback', 'isProcessed']);
    return Object.keys(request || {})
      .filter(k => !shown.has(k) && request[k] !== null && request[k] !== undefined && request[k] !== '')
      .map((key) => {
        const value = request[key];
        const isDate = typeof value === 'string' && !isNaN(Date.parse(value));
        return { key, value: Array.isArray(value) ? value.join(', ') : value, isDate };
      });
  }
}
