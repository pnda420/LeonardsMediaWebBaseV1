import { Component, ElementRef, ViewChild, effect, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PreviewService } from '../../../state/preview.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss'] // FIX: Angular erwartet "styleUrls"
})
export class MainContainerComponent {
  @ViewChild('previewHost', { static: true }) previewHost!: ElementRef<HTMLDivElement>;

  sanitizedBody: SafeHtml = '';
  private headStyleEl?: HTMLStyleElement;

  constructor(
    private previews: PreviewService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {
    effect(() => {
      const list = this.previews.previews();
      const latest = list.length ? list[list.length - 1] : null;
      const raw = latest?.html ?? '';

      const css = this.collectStyles(raw);
      const bodyOnly = raw.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

      // Body sicher einfügen
      this.sanitizedBody = this.sanitizer.bypassSecurityTrustHtml(bodyOnly);

      // CSS scopen und stabil in <head> setzen (wird nicht von innerHTML überschrieben)
      const scoped = this.scopeCss(css, '.preview-host');
      this.applyStylesToHead(scoped);
    });
  }

  private collectStyles(html: string): string {
    const blocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
    return blocks.map(m => m[1]).join('\n');
  }

  /**
   * Robustere Scoping-Variante:
   * - ersetzt :root/html/body durch den Scope
   * - prefixed Selektoren außerhalb von @-Regeln
   * - verarbeitet @media/@supports und prefix't deren innere Selektoren
   *  (einfacher Heuristik-Ansatz, kein vollständiger CSS-Parser)
   */
  private scopeCss(css: string, scope: string): string {
    if (!css) return '';

    // 1) :root, html, body -> scope
    css = css.replace(/(^|\})\s*(:root|html|body)\s*\{/g, (_m, brace) => `${brace} ${scope} {`);

    // Helper zum Prefixen einer Selektorenliste
    const prefixSelectors = (selectors: string) => selectors
      .split(',')
      .map(s => s.trim())
      .map(s => (s.startsWith(scope) || s.startsWith('@')) ? s : `${scope} ${s}`)
      .join(', ');

    // 2) @media / @supports Blöcke bearbeiten
    css = css.replace(/@media[^{]+\{([\s\S]*?)\}/g, (block) => {
      return block.replace(/(^|\})\s*([^@][^{]+)\{/g, (m, brace, selectors) => `${brace} ${prefixSelectors(selectors)}{`);
    });

    css = css.replace(/@supports[^{]+\{([\s\S]*?)\}/g, (block) => {
      return block.replace(/(^|\})\s*([^@][^{]+)\{/g, (m, brace, selectors) => `${brace} ${prefixSelectors(selectors)}{`);
    });

    // 3) normale Regeln außerhalb von @-Regeln
    css = css.replace(/(^|\})\s*([^@][^{]+)\{/g, (m, brace, selectors) => `${brace} ${prefixSelectors(selectors)}{`);

    return css;
  }

  private applyStylesToHead(css: string) {
    if (!this.headStyleEl) {
      this.headStyleEl = this.renderer.createElement('style');
      this.headStyleEl!.id = 'preview-styles';
      this.headStyleEl!.type = 'text/css';
      this.renderer.appendChild(document.head, this.headStyleEl);
    }
    this.headStyleEl!.textContent = css || '';
  }

  blockInteractions(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest('a, button, [role="button"], input, select, textarea')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  goBack() { this.router.navigate(['/']); }
}