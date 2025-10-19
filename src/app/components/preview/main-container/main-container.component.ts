import { Component, ElementRef, ViewChild, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PreviewService } from '../../../state/preview.service';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../api/api.service';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from '../../../shared/confirmation/confirmation.service';

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit, OnDestroy {
  @ViewChild('previewIframe', { static: false }) previewIframe!: ElementRef<HTMLIFrameElement>;

  loading = false;
  hasContent = false;

  publicPreview: {
    id: string;
    name: string;
    createdAt?: string | Date;
    form?: any;
    html: string;
  } | null = null;

  constructor(
    private previewService: PreviewService,
    private authService: AuthService,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {
    // Effekt für Live-Updates der Preview-Liste (nur für eingeloggte Nutzer)
    effect(() => {
      const list = this.previewService.previews();
      const selected = this.previewService.selected();

      // Wenn öffentliche Vorschau aktiv ist, nicht leeren.
      if (this.publicPreview) {
        this.hasContent = true;
        return;
      }

      if (!selected && list.length === 0) {
        this.hasContent = false;
        this.clearIframe();
        return;
      }

      const current = selected ?? list[list.length - 1];
      if (current?.html) {
        this.hasContent = true;
        // Sicherstellen, dass das iframe im DOM ist
        setTimeout(() => this.renderInIframe(current.html), 0);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    const currentUser = this.authService.getCurrentUser();
    const isLoggedIn = !!currentUser?.id;

    // Query-Parameter beobachten (id)
    this.route.queryParams.subscribe(async params => {
      const urlId = params['id'] as string | undefined;

      // Eingeloggt: User-Seiten laden (wie bisher)
      if (isLoggedIn) {
        await this.previewService.loadUserPages(currentUser!.id);

        if (urlId) {
          // In den geladenen Previews suchen
          const previews = this.previewService.previews();
          const index = previews.findIndex(p => p.id === urlId);
          if (index !== -1) {
            this.publicPreview = null;
            this.previewService.selectByIndex(index);
            this.loading = false;
            return;
          }

          // Nicht gefunden -> öffentlich per Backend laden
          try {
            const page = await this.api.getGeneratedPage(urlId).toPromise();
            if (page?.pageContent) {
              this.publicPreview = {
                id: page.id,
                name: page.name || 'Unbenannt',
                createdAt: page.createdAt,
                form: undefined,
                html: page.pageContent
              };
              this.hasContent = true;
              // Warten bis *ngIf das iframe rendert
              setTimeout(() => this.renderInIframe(page.pageContent), 0);
            } else {
              this.publicPreview = null;
              this.hasContent = false;
            }
          } catch (e) {
            console.error('⚠️ Seite per ID nicht gefunden oder nicht zugreifbar:', e);
            this.publicPreview = null;
            this.hasContent = false;
          }
        } else {
          // Kein URL-ID -> normales Verhalten
          const current = this.previewService.selected() ?? this.previewService.previews().at(-1);
          if (current?.html) {
            this.hasContent = true;
            setTimeout(() => this.renderInIframe(current.html), 0);
          } else {
            this.hasContent = false;
          }
        }

        this.loading = false;
        return;
      }

      // Nicht eingeloggt: bei vorhandener id öffentlich laden
      if (urlId) {
        try {
          const page = await this.api.getGeneratedPage(urlId).toPromise();
          if (page?.pageContent) {
            this.publicPreview = {
              id: page.id,
              name: page.name || 'Unbenannt',
              createdAt: page.createdAt,
              form: undefined,
              html: page.pageContent
            };
            this.hasContent = true;
            // Nächster Tick, damit das iframe existiert
            setTimeout(() => this.renderInIframe(page.pageContent), 0);
          } else {
            this.publicPreview = null;
            this.hasContent = false;
          }
        } catch (e) {
          console.error('⚠️ Öffentliche Seite per ID nicht gefunden:', e);
          this.publicPreview = null;
          this.hasContent = false;
        }
      } else {
        // Kein id -> nichts zu rendern
        this.publicPreview = null;
        this.hasContent = false;
      }

      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.clearIframe();
  }

  getCurrentDate(): Date {
    return new Date();
  }

  private renderInIframe(html: string): void {
    // Defensive: falls iframe noch nicht gerendert ist, im nächsten Tick erneut versuchen
    const iframeEl = this.previewIframe?.nativeElement;
    if (!iframeEl) {
      setTimeout(() => this.renderInIframe(html), 0);
      return;
    }

    const iframeDoc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
    if (!iframeDoc) {
      setTimeout(() => this.renderInIframe(html), 0);
      return;
    }

    const safeHtml = this.injectSafetyScript(html);

    iframeDoc.open();
    iframeDoc.write(safeHtml);
    iframeDoc.close();

    setTimeout(() => this.debugIframeStyles(), 500);
  }

  private clearIframe(): void {
    if (!this.previewIframe?.nativeElement) return;

    const iframe = this.previewIframe.nativeElement;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write('');
      iframeDoc.close();
    }
  }

  routeTo(route: string): void {
    this.router.navigate([route]);
  }

  private injectSafetyScript(html: string): string {
    const safetyScript = `
    <script>
      document.addEventListener('click', function(e) {
        const target = e.target && (e.target.closest && e.target.closest('a, button, [role="button"]'));
        if (target) { e.preventDefault(); e.stopPropagation(); return false; }
      }, true);

      document.addEventListener('submit', function(e) { e.preventDefault(); return false; }, true);

      window.addEventListener('beforeunload', function(e) { e.preventDefault(); return false; });
    </script>
    `;

    const bodyCloseIndex = html.lastIndexOf('</body>');
    if (bodyCloseIndex > -1) {
      return html.substring(0, bodyCloseIndex) + safetyScript + html.substring(bodyCloseIndex);
    }
    return html + safetyScript;
  }

  private debugIframeStyles(): void {
    if (!this.previewIframe?.nativeElement) return;

    const iframe = this.previewIframe.nativeElement;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc || !iframe.contentWindow) return;

    const body = iframeDoc.body;
    const computedStyle = iframe.contentWindow.getComputedStyle(body);

    console.log('🎨 iframe body styles:');
    console.log('  background:', computedStyle.backgroundColor);
    console.log('  color:', computedStyle.color);
    console.log('  font-family:', computedStyle.fontFamily);

    const h1Elements = iframeDoc.querySelectorAll('h1');
    h1Elements.forEach((h1, i) => {
      const h1Style = iframe.contentWindow!.getComputedStyle(h1);
      console.log(`📝 h1[${i}] color:`, h1Style.color, '| text:', h1.textContent?.substring(0, 30));
    });

    const heroElements = iframeDoc.querySelectorAll('.hero, [class*="hero"]');
    if (heroElements.length > 0) {
      console.log('🦸 Hero sections gefunden:', heroElements.length);
      heroElements.forEach((hero, i) => {
        const heroStyle = iframe.contentWindow!.getComputedStyle(hero);
        console.log(`  hero[${i}] background:`, heroStyle.backgroundColor);
      });
    }
  }

  // ==================== UI Helpers ====================

  getCurrentScreenWidth(): number {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  onPreviewChange(ev: Event): void {
    const target = ev.target as HTMLElement;

    if (target.tagName === 'SELECT') {
      const select = target as HTMLSelectElement;
      const selectedId = select.value;
      const previews = this.previewService.previews();
      const index = previews.findIndex(p => p.id === selectedId);

      if (index !== -1) {
        this.publicPreview = null; // wechsle zurück auf User-Preview-Modus
        this.previewService.selectByIndex(index);

        // Update URL ohne reload
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { id: selectedId },
          queryParamsHandling: 'merge'
        });
      }
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  getAllPreviews() {
    return this.previewService.previews();
  }

  getSelectedPreview() {
    return this.previewService.selected();
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Unbekannt';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // NEU: Mit Confirmation Service
  async deleteCurrent(): Promise<void> {
    const selected = this.previewService.selected();
    const currentUser = this.authService.getCurrentUser();

    if (!selected?.pageId || !currentUser?.id) return;

    const confirmed = await this.confirmationService.confirm({
      title: 'Seite löschen',
      message: 'Möchtest du diese Seite wirklich löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden.',
      confirmText: 'Ja, löschen',
      cancelText: 'Abbrechen',
      type: 'danger',
      icon: 'delete'
    });

    if (!confirmed) return;

    this.loading = true;
    const success = await this.previewService.deletePage(selected.pageId, currentUser.id);
    this.loading = false;

    if (success) {
      // URL Parameter entfernen
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {}
      });

      await this.confirmationService.confirm({
        title: 'Gelöscht!',
        message: 'Die Seite wurde erfolgreich gelöscht.',
        confirmText: 'OK',
        type: 'success',
        icon: 'check_circle'
      });
    } else {
      await this.confirmationService.confirm({
        title: 'Fehler',
        message: 'Beim Löschen der Seite ist ein Fehler aufgetreten.',
        confirmText: 'OK',
        type: 'danger',
        icon: 'error'
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/preview-form']);
  }
}