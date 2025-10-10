import { Component, ElementRef, ViewChild, effect, OnInit, OnDestroy } from '@angular/core';
import { PreviewService } from '../../../state/preview.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit, OnDestroy {
  @ViewChild('previewIframe', { static: false }) previewIframe!: ElementRef<HTMLIFrameElement>;

  loading = false;
  hasContent = false;

  constructor(
    private previewService: PreviewService,
    private authService: AuthService,
    private router: Router
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
        // Warte kurz bis iframe im DOM ist
        setTimeout(() => this.renderInIframe(current.html), 50);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.loading = true;
      await this.previewService.loadUserPages(currentUser.id);
      this.loading = false;
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

    console.log('📦 Original HTML Länge:', html.length);

    // ✅ Sicherheits-Script hinzufügen
    const safeHtml = this.injectSafetyScript(html);

    console.log('✅ Finale HTML Länge:', safeHtml.length);

    // ✅ Direkt in iframe schreiben - KEINE weitere Manipulation
    iframeDoc.open();
    iframeDoc.write(safeHtml);
    iframeDoc.close();

    // ✅ Debug: Check Styles nach Render
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

  // ✅ Sicherheits-Script am Ende hinzufügen
  private injectSafetyScript(html: string): string {
    const safetyScript = `
    <script>
        // Blockiere alle Interaktionen
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a, button, [role="button"]');
            if (target) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);
        
        // Forms blockieren
        document.addEventListener('submit', function(e) {
            e.preventDefault();
            return false;
        }, true);
        
        // Verhindere Navigation
        window.addEventListener('beforeunload', function(e) {
            e.preventDefault();
            return false;
        });
    </script>
    `;

    // Inject VOR </body> wenn vorhanden
    const bodyCloseIndex = html.lastIndexOf('</body>');
    if (bodyCloseIndex > -1) {
      return html.substring(0, bodyCloseIndex) + safetyScript + html.substring(bodyCloseIndex);
    }

    // Sonst am Ende
    return html + safetyScript;
  }

  // ✅ Debug: Check iframe Styles
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

    // Check alle h1 Elemente
    const h1Elements = iframeDoc.querySelectorAll('h1');
    h1Elements.forEach((h1, i) => {
      const h1Style = iframe.contentWindow!.getComputedStyle(h1);
      console.log(`📝 h1[${i}] color:`, h1Style.color, '| text:', h1.textContent?.substring(0, 30));
    });

    // Check Hero Section
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
    // Handle both button clicks and select changes
    const target = ev.target as HTMLElement;

    if (target.tagName === 'SELECT') {
      const select = target as HTMLSelectElement;
      const idx = Number(select.value);
      if (!Number.isNaN(idx)) {
        this.previewService.selectByIndex(idx);
      }
    } else if (target.classList.contains('preview-header__page-btn')) {
      const button = target as HTMLButtonElement;
      const idx = Number(button.getAttribute('data-index'));
      if (!Number.isNaN(idx)) {
        this.previewService.selectByIndex(idx);
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

  async deleteCurrent(): Promise<void> {
    const selected = this.previewService.selected();
    const currentUser = this.authService.getCurrentUser();

    if (selected?.pageId && currentUser?.id) {
      if (confirm('Diese Seite wirklich löschen?')) {
        this.loading = true;
        const success = await this.previewService.deletePage(selected.pageId, currentUser.id);
        this.loading = false;

        if (success) {
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