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

    // HTML ohne Dark Mode Styles
    const cleanedHtml = this.removeDarkModeStyles(html);

    // Vollständiges HTML-Dokument erstellen
    const fullHtml = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            width: 100%;
            height: 100%;
            overflow-x: hidden;
        }
    </style>
    ${this.extractStyles(cleanedHtml)}
</head>
<body>
    ${this.extractBody(cleanedHtml)}
    <script>
        // Alle Links und Buttons blockieren
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
    </script>
</body>
</html>
    `.trim();

    // HTML in iframe schreiben
    iframeDoc.open();
    iframeDoc.write(fullHtml);
    iframeDoc.close();
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

  private extractStyles(html: string): string {
    const styleMatches = html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    return Array.from(styleMatches).map(match => `<style>${match[1]}</style>`).join('\n');
  }

  private extractBody(html: string): string {
    // Entferne <style> Tags
    let body = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Falls es <body> Tags gibt, nur den Inhalt nehmen
    const bodyMatch = body.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      return bodyMatch[1];
    }

    return body;
  }

  private removeDarkModeStyles(html: string): string {
    if (!html) return '';

    // Entferne alle @media (prefers-color-scheme: dark) Blöcke
    html = html.replace(/@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)\s*\{[\s\S]*?\}\s*\}/gi, '');

    // Entferne Dark Mode CSS Variablen und Klassen
    html = html.replace(/(:root\[data-theme=['"]dark['"]\]|\.dark-mode|\.dark|html\.dark|body\.dark)\s*\{[\s\S]*?\}/gi, '');

    return html;
  }

  getCurrentScreenWidth(): number {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  onPreviewChange(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    const idx = Number(target.value);
    if (!Number.isNaN(idx)) {
      this.previewService.selectByIndex(idx);
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