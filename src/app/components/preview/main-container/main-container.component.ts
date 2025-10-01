import { Component, effect, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PreviewService } from '../../../state/preview.service';
import { CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.scss'
})
export class MainContainerComponent {
  public htmlSafe: SafeHtml | null = null;
  @ViewChild('previewFrame', { static: true }) frameRef!: ElementRef<HTMLIFrameElement>;


  constructor(private previews: PreviewService, private sanitizer: DomSanitizer, private router: Router) {
  }


  ngAfterViewInit() {
    effect(() => {
      const list = this.previews.previews();
      const latest = list.length ? list[list.length - 1] : null;

      const frame = this.frameRef.nativeElement;
      const doc = frame.contentDocument;

      if (!latest || !doc) {
        if (doc) doc.open(), doc.write(''), doc.close();
        return;
      }

      const html = latest.html;
      const css = latest.css;

      doc.open();
      doc.write(`<!doctype html>
  <html>
  <head><meta charset="utf-8"><style>${css}</style></head>
  <body>
    <div id="preview-root">${html}</div>
  </body>
  </html>`);
      doc.close();
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  blockLinks(e: MouseEvent) {
    const a = (e.target as HTMLElement).closest('a');
    if (a) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  getPreviewsAmount() {
    return this.previews.previews().length;
  }

  resizeFrame() {
    const frame = this.frameRef.nativeElement;
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc) return;
    // einfache Auto-Höhe
    frame.style.height = Math.max(
      doc.body?.scrollHeight || 0,
      doc.documentElement?.scrollHeight || 0
    ) + 'px';
  }

  private appendStyleOnce(id: string, css: string, scope: string): void {
    if (!css?.trim()) return;

    // jeden Selektor um den Container selektor erweitern
    const scopedCss = css.replace(/(^|\})(\s*[^{}]+)/g, (_, brace, selector) => {
      if (selector.includes('@')) return _ + selector; // @media etc. ignorieren
      return `${brace} ${scope} ${selector}`;
    });

    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      el.type = 'text/css';
      document.head.appendChild(el);
    }
    el.textContent = scopedCss;
  }

}
