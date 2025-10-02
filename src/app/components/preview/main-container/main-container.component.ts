import { Component, ElementRef, ViewChild, effect, Renderer2, AfterViewInit } from '@angular/core';
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
    private previewService: PreviewService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {
    effect(() => {
      const list = this.previewService.previews();
      const selected =
        (typeof this.previewService.selected === 'function' ? this.previewService.selected() : null) ??
        (list.length ? list[list.length - 1] : null);

      const raw = selected?.html ?? '';

      const css = this.collectStyles(raw);
      const bodyOnly = raw.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

      this.sanitizedBody = this.sanitizer.bypassSecurityTrustHtml(bodyOnly);

      const scoped = this.scopeCss(css, '.preview-host');
      this.applyStylesToHead(scoped);
    });
  }



  getCurrentScreenWidth(): number {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  onPreviewChange(ev: Event) {
    const target = ev.target as HTMLSelectElement;
    const idx = Number(target.value);
    if (!Number.isNaN(idx)) {
      this.selectCurrentPreview(idx);
    }
  }

  trackByIndex(index: number) { return index; }

  getSelectedIndex(): number {
    const list = this.previewService.previews();
    if (typeof this.previewService.selectedIndex === 'function') {
      // @ts-ignore
      const i = this.previewService.selectedIndex();
      if (typeof i === 'number' && i >= 0 && i < list.length) return i;
    }
    return Math.max(0, list.length - 1);
  }

  getAllPreviews() {
    return this.previewService.previews();
  }

  selectCurrentPreview(index: number) {
    this.previewService.selectByIndex(index);
  }

  private collectStyles(html: string): string {
    const blocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
    return blocks.map(m => m[1]).join('\n');
  }

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