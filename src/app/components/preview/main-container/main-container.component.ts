import { Component, ElementRef, ViewChild, effect, OnInit, OnDestroy } from '@angular/core';
import { PreviewService } from '../../../state/preview.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthRequiredComponent } from "../../../shared/auth-required/auth-required.component";

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [CommonModule, AuthRequiredComponent],
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit, OnDestroy {
  @ViewChild('previewIframe', { static: false }) previewIframe!: ElementRef<HTMLIFrameElement>;

  loading = false;
  hasContent = false;
  isLoggedIn = false;
  currentUrl: string = '';

  constructor(
    private previewService: PreviewService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Effect für Live-Updates der Preview
    effect(() => {
      const list = this.previewService.previews();
      const selected = this.previewService.selected();

      if (!selected && list.length === 0) {
        this.hasContent = false;
        this.clearIframe();
        return;
      }

      const current = selected ?? list[list.length - 1];
      if (current?.html) {
        this.hasContent = true;
        setTimeout(() => this.renderInIframe(current.html), 50);
      }
    });
  }

  async ngOnInit(): Promise<void> {
      this.currentUrl = this.router.url.split('?')[0];
      this.isLoggedIn = this.authService.isLoggedIn();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.loading = true;
      await this.previewService.loadUserPages(currentUser.id);
      this.loading = false;

      // Nach dem Laden: Check URL Parameter
      this.route.queryParams.subscribe(params => {
        const urlId = params['id'];
        if (urlId) {
          const previews = this.previewService.previews();
          const index = previews.findIndex(p => p.id === urlId);
          if (index !== -1) {
            this.previewService.selectByIndex(index);
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.clearIframe();
  }

  private renderInIframe(html: string): void {
    if (!this.previewIframe?.nativeElement) return;

    const iframe = this.previewIframe.nativeElement;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

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
            const target = e.target.closest('a, button, [role="button"]');
            if (target) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);
        
        document.addEventListener('submit', function(e) {
            e.preventDefault();
            return false;
        }, true);
        
        window.addEventListener('beforeunload', function(e) {
            e.preventDefault();
            return false;
        });
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

  // ==================== UI Methods ====================

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

  getSelectedIndex(): number {
    const list = this.previewService.previews();
    const idx = this.previewService.selectedIndex();
    if (typeof idx === 'number' && idx >= 0 && idx < list.length) return idx;
    return Math.max(0, list.length - 1);
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


  async deleteCurrent(): Promise<void> {
    const selected = this.previewService.selected();
    const currentUser = this.authService.getCurrentUser();

    if (selected?.pageId && currentUser?.id) {
      if (confirm('Diese Seite wirklich löschen?')) {
        this.loading = true;
        const success = await this.previewService.deletePage(selected.pageId, currentUser.id);
        this.loading = false;

        if (success) {
          // URL Parameter entfernen
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {}
          });
          alert('Seite gelöscht!');
        } else {
          alert('Fehler beim Löschen');
        }
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/preview-form']);
  }
}